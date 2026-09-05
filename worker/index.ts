/**
 * Bakesbymom API — Cloudflare Worker backed by D1 (catalog) and R2 (photos).
 *
 * The browser used to talk to Supabase directly with a public anon key. D1 has
 * no such client, so this Worker is the only thing that touches the database:
 * reads are open, writes require the admin password, and photos are streamed
 * back out of R2 through /api/photos/<key>.
 *
 * Routes
 *   GET    /api/catalog                 categories -> cakes -> cover photo
 *   GET    /api/cakes/:id               one cake with photos/flavours/add-ons
 *   POST   /api/:table                  insert  (admin)
 *   PATCH  /api/:table/:id              update  (admin)
 *   DELETE /api/:table/:id              delete  (admin)
 *   POST   /api/photos                  upload an image to R2 (admin)
 *   GET    /api/photos/*                stream an image out of R2
 *
 * Anything that isn't /api/* falls through to the static SPA assets, so the
 * site and its API share one origin when deployed to Workers.
 */

export interface Env {
  DB: D1Database;
  PHOTOS: R2Bucket;
  /** Set with `npx wrangler secret put ADMIN_PASSWORD`. Writes fail closed without it. */
  ADMIN_PASSWORD?: string;
  ASSETS: Fetcher;
}

// Tables the generic CRUD routes may touch, with their writable columns. Any
// column not listed here is ignored, so a client can never set `id`/`created_at`
// or reach a table the catalog doesn't own.
const WRITABLE: Record<string, string[]> = {
  categories: ["name", "description", "image_url", "sort_order"],
  cakes: [
    "category_id",
    "name",
    "description",
    "per_pound_price",
    "weight_kg",
    "fixed_price",
    "sort_order",
  ],
  cake_photos: ["cake_id", "url", "sort_order"],
  cake_flavours: ["cake_id", "name", "price_delta", "sort_order"],
  cake_addons: ["cake_id", "name", "price_delta", "sort_order"],
};

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

/** Every write goes through here. No configured password ⇒ nothing may write. */
function requireAdmin(request: Request, env: Env): void {
  if (!env.ADMIN_PASSWORD) {
    throw new HttpError(503, "Admin writes are disabled: ADMIN_PASSWORD is not set on the Worker.");
  }
  if (request.headers.get("x-admin-password") !== env.ADMIN_PASSWORD) {
    throw new HttpError(401, "Wrong admin password.");
  }
}

/** Keep only the columns this table allows a client to set. */
function pickColumns(table: string, input: Record<string, unknown>) {
  const allowed = WRITABLE[table];
  if (!allowed) throw new HttpError(404, `Unknown table "${table}".`);
  const entries = Object.entries(input).filter(
    ([key, value]) => allowed.includes(key) && value !== undefined,
  );
  if (entries.length === 0) throw new HttpError(400, "No writable fields in request body.");
  return entries;
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Request body must be JSON.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }
  return body as Record<string, unknown>;
}

// ---------------------------------------------------------------------------
//  Reads
// ---------------------------------------------------------------------------

/** Everything the Catalog page needs, assembled in one round trip. */
async function getCatalog(env: Env): Promise<Response> {
  const [categories, cakes, photos] = await env.DB.batch([
    env.DB.prepare("select * from categories order by sort_order, name"),
    env.DB.prepare("select * from cakes order by sort_order, name"),
    env.DB.prepare("select cake_id, url from cake_photos order by sort_order"),
  ]);

  const coverByCake = new Map<string, string>();
  for (const photo of photos.results as { cake_id: string; url: string }[]) {
    if (!coverByCake.has(photo.cake_id)) coverByCake.set(photo.cake_id, photo.url);
  }

  const allCakes = cakes.results as Record<string, unknown>[];
  return json(
    (categories.results as Record<string, unknown>[]).map((category) => ({
      ...category,
      cakes: allCakes
        .filter((cake) => cake.category_id === category.id)
        .map((cake) => ({ ...cake, cover_url: coverByCake.get(cake.id as string) ?? null })),
    })),
  );
}

/** A single cake with photos, flavours, add-ons and its category. */
async function getCakeDetail(env: Env, cakeId: string): Promise<Response> {
  const cake = await env.DB.prepare("select * from cakes where id = ?").bind(cakeId).first();
  if (!cake) return json(null);

  const [category, photos, flavours, addons] = await env.DB.batch([
    env.DB.prepare("select * from categories where id = ?").bind(cake.category_id),
    env.DB.prepare("select * from cake_photos where cake_id = ? order by sort_order").bind(cakeId),
    env.DB.prepare("select * from cake_flavours where cake_id = ? order by sort_order").bind(cakeId),
    env.DB.prepare("select * from cake_addons where cake_id = ? order by sort_order").bind(cakeId),
  ]);

  return json({
    ...cake,
    category: category.results[0] ?? null,
    photos: photos.results,
    flavours: flavours.results,
    addons: addons.results,
  });
}

// ---------------------------------------------------------------------------
//  Writes
// ---------------------------------------------------------------------------

async function insertRow(env: Env, table: string, input: Record<string, unknown>) {
  const entries = pickColumns(table, input);
  const id = crypto.randomUUID();
  const columns = ["id", ...entries.map(([key]) => key)];
  const values = [id, ...entries.map(([, value]) => value)];

  const row = await env.DB.prepare(
    `insert into ${table} (${columns.join(", ")}) values (${columns.map(() => "?").join(", ")}) returning *`,
  )
    .bind(...(values as (string | number | boolean | null)[]))
    .first();

  return json(row, 201);
}

async function updateRow(env: Env, table: string, id: string, input: Record<string, unknown>) {
  const entries = pickColumns(table, input);
  const row = await env.DB.prepare(
    `update ${table} set ${entries.map(([key]) => `${key} = ?`).join(", ")} where id = ? returning *`,
  )
    .bind(...(entries.map(([, value]) => value) as (string | number | boolean | null)[]), id)
    .first();

  if (!row) throw new HttpError(404, `No ${table} row with id ${id}.`);
  return json(row);
}

async function deleteRow(env: Env, table: string, id: string) {
  if (!WRITABLE[table]) throw new HttpError(404, `Unknown table "${table}".`);
  await env.DB.prepare(`delete from ${table} where id = ?`).bind(id).run();
  return new Response(null, { status: 204 });
}

// ---------------------------------------------------------------------------
//  Photos (R2)
// ---------------------------------------------------------------------------

/** Upload one image and return the URL the site should store and render. */
async function uploadPhoto(request: Request, env: Env, url: URL): Promise<Response> {
  const form = await request.formData();
  const file = form.get("file");
  const cakeId = String(form.get("cakeId") ?? "").trim();

  if (!(file instanceof File)) throw new HttpError(400, "Expected a `file` field.");
  if (!cakeId || !/^[A-Za-z0-9_-]+$/.test(cakeId)) throw new HttpError(400, "Invalid `cakeId`.");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new HttpError(415, `Unsupported image type "${file.type || "unknown"}".`);
  }
  if (file.size > MAX_PHOTO_BYTES) throw new HttpError(413, "Image is larger than 10 MB.");

  const ext = (file.name.split(".").pop() ?? "").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const key = `${cakeId}/${crypto.randomUUID()}.${ext}`;

  await env.PHOTOS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });

  return json({ url: new URL(`/api/photos/${key}`, url.origin).toString() }, 201);
}

async function servePhoto(env: Env, key: string): Promise<Response> {
  const object = await env.PHOTOS.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

// ---------------------------------------------------------------------------
//  Router
// ---------------------------------------------------------------------------

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  // ["api", ...rest]
  const [, ...segments] = url.pathname.split("/").filter(Boolean);
  const [head, ...rest] = segments;

  if (head === "photos") {
    if (request.method === "GET" && rest.length > 0) return servePhoto(env, rest.join("/"));
    if (request.method === "POST" && rest.length === 0) {
      requireAdmin(request, env);
      return uploadPhoto(request, env, url);
    }
    throw new HttpError(405, `${request.method} not allowed on /api/photos.`);
  }

  if (head === "catalog" && request.method === "GET") return getCatalog(env);

  if (head === "cakes" && rest.length === 1 && request.method === "GET") {
    return getCakeDetail(env, rest[0]);
  }

  // Generic table CRUD — /api/<table> and /api/<table>/<id>.
  if (head && WRITABLE[head]) {
    if (request.method === "POST" && rest.length === 0) {
      requireAdmin(request, env);
      return insertRow(env, head, await readJsonBody(request));
    }
    if (request.method === "PATCH" && rest.length === 1) {
      requireAdmin(request, env);
      return updateRow(env, head, rest[0], await readJsonBody(request));
    }
    if (request.method === "DELETE" && rest.length === 1) {
      requireAdmin(request, env);
      return deleteRow(env, head, rest[0]);
    }
  }

  throw new HttpError(404, `No route for ${request.method} ${url.pathname}.`);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    try {
      return await handleApi(request, env, url);
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status);
      console.error(error);
      return json({ error: "Unexpected server error." }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
