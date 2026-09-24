/**
 * Thin client for the catalog API served by the Cloudflare Worker
 * (see worker/index.ts). The Worker owns the D1 database and the R2 photo
 * bucket; the browser never talks to either directly.
 */

// Same-origin "/api" is right when the SPA is served by the Worker itself.
// Set VITE_API_BASE_URL only when the frontend is hosted elsewhere and has to
// reach the Worker cross-origin (see .env.example).
const configuredBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const API_BASE_URL = (configuredBase || "/api").replace(/\/+$/, "");

// The API always exists now that it ships with the site — kept as a named
// export so the pages can still render a friendly message if it is ever
// pointed at nothing.
export const isApiConfigured = API_BASE_URL.length > 0;

// Where the admin panel stashes the password for the current tab. Every write
// sends it as `x-admin-password`; the Worker compares it to its own secret.
const ADMIN_PASSWORD_KEY = "bbm_admin_password";

export function setAdminPassword(password: string): void {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

export function getAdminPassword(): string {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) ?? "";
}

export function clearAdminPassword(): void {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

/** Pull the Worker's `{ error }` message out of a failed response. */
async function toError(response: Response): Promise<Error> {
  let message = `Request failed (${response.status}).`;
  try {
    const body = (await response.json()) as { error?: string };
    if (body?.error) message = body.error;
  } catch {
    // Non-JSON error body — keep the status-code message.
  }
  return new Error(message);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) throw await toError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

/** POST/PATCH/DELETE against the API, authenticated as the admin. */
export function apiWrite<T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
  return request<T>(path, {
    method,
    headers: {
      "x-admin-password": getAdminPassword(),
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** Multipart upload — no JSON content-type, the browser sets the boundary. */
export function apiUpload<T>(path: string, form: FormData): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "x-admin-password": getAdminPassword() },
    body: form,
  });
}

/**
 * Cakes we have re-shot against a styled background. The bucket still holds the
 * phone photo under its original key — and D1, the products shelf and the
 * showcase all still point at that key — so the swap lives here: one entry per
 * cake, old R2 key on the left, the restaged picture that ships with the site
 * on the right. Drop an entry and the original comes straight back.
 */
const RESTAGED_PHOTOS: Record<string, string> = {
  "IMG-20260913-WA0003.png": "/photos/restaged/anniversary-maroon.jpg",
  "IMG-20251128-WA0019.png": "/photos/restaged/bride-to-be.jpg",
  "IMG-20260213-WA0054.png": "/photos/restaged/mom-butterfly.jpg",
  "IMG-20251130-WA0019.png": "/photos/restaged/engaged-hands.jpg",
  "IMG-20260808-WA0046.png": "/photos/restaged/mom-flowerpot.jpg",
  "IMG-20251130-WA0022.png": "/photos/restaged/mom-photo-clothesline.jpg",
};

/**
 * Photo URLs are stored in D1 as the Worker path "/api/photos/<key>". That
 * resolves on its own when the Worker serves the SPA, but not when the site is
 * hosted elsewhere and points at the Worker through VITE_API_BASE_URL — so
 * rebase the path onto the configured API origin here. Absolute URLs (what the
 * admin upload route returns) are handed back untouched.
 */
export function resolvePhotoUrl(url: string): string {
  const restaged = RESTAGED_PHOTOS[url.slice(url.lastIndexOf("/") + 1)];
  if (restaged) return restaged;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) return url;
  const path = url.startsWith("/api/") ? url.slice("/api".length) : url;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
