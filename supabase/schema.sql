-- ============================================================================
-- Bakes by Mom — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / drops-then-creates policies).
-- ============================================================================

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text,
  product     text not null,
  category    text,
  occasion    text,
  event_date  date,
  servings    text,
  message     text,
  status      text not null default 'new'
);

alter table public.orders enable row level security;

-- Anyone (anon) can place an order, but cannot read orders back.
drop policy if exists "anon can insert orders" on public.orders;
create policy "anon can insert orders"
  on public.orders for insert
  to anon
  with check (true);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  product     text,
  message     text not null
);

alter table public.reviews enable row level security;

-- Anyone can read reviews (so they show on the site)...
drop policy if exists "anon can read reviews" on public.reviews;
create policy "anon can read reviews"
  on public.reviews for select
  to anon
  using (true);

-- ...and anyone can submit a review.
drop policy if exists "anon can insert reviews" on public.reviews;
create policy "anon can insert reviews"
  on public.reviews for insert
  to anon
  with check (char_length(message) between 1 and 2000 and rating between 1 and 5);

-- Optional: a couple of seed reviews so the page isn't empty on first load.
insert into public.reviews (name, rating, product, message)
select * from (values
  ('Anjali & Rohan', 5, 'Wedding Cakes', 'The wedding cake was beyond anything we imagined. Every guest asked for the baker''s number — rose lychee with champagne cream, simply magical.'),
  ('Meera Kapoor', 5, 'Brownies, Cupcakes & Cookies', 'Ordered a birthday dessert box for my daughter and she cried happy tears. Fudgy perfection and Instagram-gold presentation.'),
  ('Sanjay & Naina', 5, 'Anniversary Cakes', 'A three-tier floral cake for our anniversary that left everyone speechless. Attention to detail and flavour were sublime.')
) as seed(name, rating, product, message)
where not exists (select 1 from public.reviews);
