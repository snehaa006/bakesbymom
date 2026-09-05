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
