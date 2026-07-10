import { PHOTO_BUCKET, supabase } from "./supabase";

// ---------------------------------------------------------------------------
//  Types (mirror the tables in supabase/schema.sql)
// ---------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Cake {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  per_pound_price: number;
  weight_kg: number;
  fixed_price: number;
  sort_order: number;
  created_at: string;
}

export interface CakePhoto {
  id: string;
  cake_id: string;
  url: string;
  sort_order: number;
}

export interface CakeFlavour {
  id: string;
  cake_id: string;
  name: string;
  price_delta: number;
  sort_order: number;
}

export interface CakeAddon {
  id: string;
  cake_id: string;
  name: string;
  price_delta: number;
  sort_order: number;
}

/** A cake plus everything shown on its detail page. */
export interface CakeDetail extends Cake {
  category: Category | null;
  photos: CakePhoto[];
  flavours: CakeFlavour[];
  addons: CakeAddon[];
}

/** A category with its cakes and one cover photo per cake (for the grid). */
export interface CategoryWithCakes extends Category {
  cakes: (Cake & { cover_url: string | null })[];
}

// Small helper so every call surfaces a readable error.
function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ---------------------------------------------------------------------------
//  Reads (public site)
// ---------------------------------------------------------------------------

/** Everything the Catalog page needs: categories → cakes → cover photo. */
export async function fetchCatalog(): Promise<CategoryWithCakes[]> {
  const categories = unwrap(
    ...toTuple(
      await supabase.from("categories").select("*").order("sort_order").order("name"),
    ),
  ) as Category[];

  const cakes = unwrap(
    ...toTuple(await supabase.from("cakes").select("*").order("sort_order").order("name")),
  ) as Cake[];

  const photos = unwrap(
    ...toTuple(await supabase.from("cake_photos").select("*").order("sort_order")),
  ) as CakePhoto[];

  const coverByCake = new Map<string, string>();
  for (const p of photos) {
    if (!coverByCake.has(p.cake_id)) coverByCake.set(p.cake_id, p.url);
  }

  return categories.map((cat) => ({
    ...cat,
    cakes: cakes
      .filter((c) => c.category_id === cat.id)
      .map((c) => ({ ...c, cover_url: coverByCake.get(c.id) ?? null })),
  }));
}

/** A single cake with photos, flavours, add-ons and its category. */
export async function fetchCakeDetail(cakeId: string): Promise<CakeDetail | null> {
  const cake = unwrap(
    ...toTuple(await supabase.from("cakes").select("*").eq("id", cakeId).maybeSingle()),
  ) as Cake | null;
  if (!cake) return null;

  const [category, photos, flavours, addons] = await Promise.all([
    supabase.from("categories").select("*").eq("id", cake.category_id).maybeSingle(),
    supabase.from("cake_photos").select("*").eq("cake_id", cakeId).order("sort_order"),
    supabase.from("cake_flavours").select("*").eq("cake_id", cakeId).order("sort_order"),
    supabase.from("cake_addons").select("*").eq("cake_id", cakeId).order("sort_order"),
  ]);

  return {
    ...cake,
    category: unwrap(...toTuple(category)) as Category | null,
    photos: (unwrap(...toTuple(photos)) as CakePhoto[]) ?? [],
    flavours: (unwrap(...toTuple(flavours)) as CakeFlavour[]) ?? [],
    addons: (unwrap(...toTuple(addons)) as CakeAddon[]) ?? [],
  };
}

/**
 * Final price = fixed base price + chosen flavour surcharge + selected add-ons.
 * The per-pound price and weight are shown for reference only.
 */
export function computeFinalPrice(
  cake: Pick<CakeDetail, "fixed_price">,
  flavour: CakeFlavour | null,
  selectedAddons: CakeAddon[],
): number {
  const base = Number(cake.fixed_price) || 0;
  const flavourDelta = flavour ? Number(flavour.price_delta) || 0 : 0;
  const addonsDelta = selectedAddons.reduce((sum, a) => sum + (Number(a.price_delta) || 0), 0);
  return base + flavourDelta + addonsDelta;
}

// ---------------------------------------------------------------------------
//  Writes (admin panel)
// ---------------------------------------------------------------------------

// Categories -----------------------------------------------------------------
export async function createCategory(input: Partial<Category>) {
  return unwrap(...toTuple(await supabase.from("categories").insert(input).select().single()));
}
export async function updateCategory(id: string, input: Partial<Category>) {
  return unwrap(
    ...toTuple(await supabase.from("categories").update(input).eq("id", id).select().single()),
  );
}
export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Cakes ----------------------------------------------------------------------
export async function createCake(input: Partial<Cake>) {
  return unwrap(...toTuple(await supabase.from("cakes").insert(input).select().single()));
}
export async function updateCake(id: string, input: Partial<Cake>) {
  return unwrap(
    ...toTuple(await supabase.from("cakes").update(input).eq("id", id).select().single()),
  );
}
export async function deleteCake(id: string) {
  const { error } = await supabase.from("cakes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Photos ---------------------------------------------------------------------
/** Upload an image file to Storage and return its public URL. */
export async function uploadPhoto(cakeId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${cakeId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function addPhoto(cakeId: string, url: string, sortOrder = 0) {
  return unwrap(
    ...toTuple(
      await supabase
        .from("cake_photos")
        .insert({ cake_id: cakeId, url, sort_order: sortOrder })
        .select()
        .single(),
    ),
  );
}
export async function deletePhoto(id: string) {
  const { error } = await supabase.from("cake_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Flavours -------------------------------------------------------------------
export async function addFlavour(input: Partial<CakeFlavour>) {
  return unwrap(...toTuple(await supabase.from("cake_flavours").insert(input).select().single()));
}
export async function updateFlavour(id: string, input: Partial<CakeFlavour>) {
  return unwrap(
    ...toTuple(await supabase.from("cake_flavours").update(input).eq("id", id).select().single()),
  );
}
export async function deleteFlavour(id: string) {
  const { error } = await supabase.from("cake_flavours").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Add-ons --------------------------------------------------------------------
export async function addAddon(input: Partial<CakeAddon>) {
  return unwrap(...toTuple(await supabase.from("cake_addons").insert(input).select().single()));
}
export async function updateAddon(id: string, input: Partial<CakeAddon>) {
  return unwrap(
    ...toTuple(await supabase.from("cake_addons").update(input).eq("id", id).select().single()),
  );
}
export async function deleteAddon(id: string) {
  const { error } = await supabase.from("cake_addons").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Supabase returns { data, error }; spread it into unwrap(data, error).
function toTuple<T>(res: { data: T; error: { message: string } | null }): [T, { message: string } | null] {
  return [res.data, res.error];
}
