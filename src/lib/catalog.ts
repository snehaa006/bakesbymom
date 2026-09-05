import { apiGet, apiUpload, apiWrite } from "./api";

// ---------------------------------------------------------------------------
//  Types (mirror the tables in db/schema.sql)
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

// ---------------------------------------------------------------------------
//  Reads (public site)
// ---------------------------------------------------------------------------

/** Everything the Catalog page needs: categories → cakes → cover photo. */
export function fetchCatalog(): Promise<CategoryWithCakes[]> {
  return apiGet<CategoryWithCakes[]>("/catalog");
}

/** A single cake with photos, flavours, add-ons and its category. */
export function fetchCakeDetail(cakeId: string): Promise<CakeDetail | null> {
  return apiGet<CakeDetail | null>(`/cakes/${encodeURIComponent(cakeId)}`);
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
//  Writes (admin panel) — each one sends the admin password to the Worker.
// ---------------------------------------------------------------------------

// Categories -----------------------------------------------------------------
export function createCategory(input: Partial<Category>) {
  return apiWrite<Category>("/categories", "POST", input);
}
export function updateCategory(id: string, input: Partial<Category>) {
  return apiWrite<Category>(`/categories/${encodeURIComponent(id)}`, "PATCH", input);
}
export function deleteCategory(id: string) {
  return apiWrite<void>(`/categories/${encodeURIComponent(id)}`, "DELETE");
}

// Cakes ----------------------------------------------------------------------
export function createCake(input: Partial<Cake>) {
  return apiWrite<Cake>("/cakes", "POST", input);
}
export function updateCake(id: string, input: Partial<Cake>) {
  return apiWrite<Cake>(`/cakes/${encodeURIComponent(id)}`, "PATCH", input);
}
export function deleteCake(id: string) {
  return apiWrite<void>(`/cakes/${encodeURIComponent(id)}`, "DELETE");
}

// Photos ---------------------------------------------------------------------
/** Upload an image to R2 and return the URL it is served from. */
export async function uploadPhoto(cakeId: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("cakeId", cakeId);
  form.append("file", file);
  const { url } = await apiUpload<{ url: string }>("/photos", form);
  return url;
}

export function addPhoto(cakeId: string, url: string, sortOrder = 0) {
  return apiWrite<CakePhoto>("/cake_photos", "POST", {
    cake_id: cakeId,
    url,
    sort_order: sortOrder,
  });
}
export function deletePhoto(id: string) {
  return apiWrite<void>(`/cake_photos/${encodeURIComponent(id)}`, "DELETE");
}

// Flavours -------------------------------------------------------------------
export function addFlavour(input: Partial<CakeFlavour>) {
  return apiWrite<CakeFlavour>("/cake_flavours", "POST", input);
}
export function updateFlavour(id: string, input: Partial<CakeFlavour>) {
  return apiWrite<CakeFlavour>(`/cake_flavours/${encodeURIComponent(id)}`, "PATCH", input);
}
export function deleteFlavour(id: string) {
  return apiWrite<void>(`/cake_flavours/${encodeURIComponent(id)}`, "DELETE");
}

// Add-ons --------------------------------------------------------------------
export function addAddon(input: Partial<CakeAddon>) {
  return apiWrite<CakeAddon>("/cake_addons", "POST", input);
}
export function updateAddon(id: string, input: Partial<CakeAddon>) {
  return apiWrite<CakeAddon>(`/cake_addons/${encodeURIComponent(id)}`, "PATCH", input);
}
export function deleteAddon(id: string) {
  return apiWrite<void>(`/cake_addons/${encodeURIComponent(id)}`, "DELETE");
}
