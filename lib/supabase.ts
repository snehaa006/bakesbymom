import { createClient } from "@supabase/supabase-js";

// These are PUBLIC client credentials (anon key). They are safe to ship to the
// browser and are protected by Row Level Security on the database side.
// Prefer environment variables; fall back to the project defaults so the site
// keeps working even before the Vercel env vars are configured.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://hbnfrkcmjtitsmsbsyjm.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibmZya2NtanRpdHNtc2JzeWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg4ODAsImV4cCI6MjA5NzQ0NDg4MH0.h7EpHCVekMfxPe0FckeBlmnLi1Jjj6jS-zX3AQz3Yb4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// ----- Table row shapes -----

export interface OrderRow {
  name: string;
  phone: string;
  email: string | null;
  product: string;
  category: string | null;
  occasion: string | null;
  event_date: string | null; // YYYY-MM-DD
  servings: string | null;
  message: string | null;
}

export interface ReviewRow {
  id?: string;
  created_at?: string;
  name: string;
  rating: number; // 1..5
  product: string | null;
  message: string;
}

// ----- Data access helpers -----

export async function submitOrder(order: OrderRow) {
  const { error } = await supabase.from("orders").insert([order]);
  if (error) throw error;
}

export async function submitReview(review: ReviewRow) {
  const { error } = await supabase.from("reviews").insert([review]);
  if (error) throw error;
}

export async function fetchReviews(limit = 50): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, created_at, name, rating, product, message")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ReviewRow[];
}
