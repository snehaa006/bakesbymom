import { createClient } from "@supabase/supabase-js";

// These come from your Supabase project: Project Settings → API.
// Put them in a .env file at the project root (see .env.example):
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// `true` only when both env vars are present. The UI uses this to show a
// friendly "not configured yet" message instead of crashing.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// We still create a client with placeholder values when unconfigured so imports
// don't throw; any real call will simply fail until the env vars are set.
export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
);

// Name of the public Storage bucket created by supabase/schema.sql.
export const PHOTO_BUCKET = "cake-photos";
