-- ============================================================================
--  Bakesbymom — Cake Catalog schema for Supabase
-- ============================================================================
--  HOW TO RUN
--  1. Open your Supabase project → SQL Editor → New query
--  2. Paste this whole file and click "Run".
--  3. It is safe to run more than once (uses IF NOT EXISTS / ON CONFLICT).
--
--  WHAT IT CREATES
--  - Tables: categories, cakes, cake_photos, cake_flavours, cake_addons
--  - Row Level Security (RLS) + policies
--  - GRANTs for the anon / authenticated roles
--  - A public Storage bucket ("cake-photos") for uploaded cake images
--
--  SECURITY NOTE (READ ME)
--  The admin panel in the app is protected only by a client-side password,
--  so by default the policies below let the "anon" role read AND write.
--  This is fine for a small personal/demo site, but anyone with your public
--  anon key could technically write to these tables. When you are ready to
--  lock it down, jump to the "OPTION B — Lock writes behind Supabase Auth"
--  section at the bottom of this file.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
--  TABLES
-- ---------------------------------------------------------------------------

-- A category groups cakes together, e.g. "Birthday", "Wedding", "Cupcakes".
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- A single cake within a category.
create table if not exists public.cakes (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references public.categories (id) on delete cascade,
  name            text not null,
  description     text,
  -- price per pound (informational, shown on the detail page)
  per_pound_price numeric(10, 2) not null default 0,
  -- default / reference weight in kilograms
  weight_kg       numeric(10, 2) not null default 0,
  -- the base ("fixed") price the final price is built on top of
  fixed_price     numeric(10, 2) not null default 0,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

-- Photos for a cake (a cake can have many).
create table if not exists public.cake_photos (
  id         uuid primary key default gen_random_uuid(),
  cake_id    uuid not null references public.cakes (id) on delete cascade,
  url        text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Flavour options for a cake — used to populate the dropdown on the detail page.
-- price_delta lets a flavour optionally add to the price (0 = no extra charge).
create table if not exists public.cake_flavours (
  id          uuid primary key default gen_random_uuid(),
  cake_id     uuid not null references public.cakes (id) on delete cascade,
  name        text not null,
  price_delta numeric(10, 2) not null default 0,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Customization add-ons for a cake (e.g. "Extra tier", "Fresh flowers").
-- Selecting these adds price_delta to the final price.
create table if not exists public.cake_addons (
  id          uuid primary key default gen_random_uuid(),
  cake_id     uuid not null references public.cakes (id) on delete cascade,
  name        text not null,
  price_delta numeric(10, 2) not null default 0,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Helpful indexes for the foreign-key lookups the app does constantly.
create index if not exists idx_cakes_category   on public.cakes (category_id);
create index if not exists idx_photos_cake      on public.cake_photos (cake_id);
create index if not exists idx_flavours_cake    on public.cake_flavours (cake_id);
create index if not exists idx_addons_cake      on public.cake_addons (cake_id);

-- ---------------------------------------------------------------------------
--  ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.categories    enable row level security;
alter table public.cakes         enable row level security;
alter table public.cake_photos   enable row level security;
alter table public.cake_flavours enable row level security;
alter table public.cake_addons   enable row level security;

-- Drop old copies of the policies so this script can be re-run safely.
do $$
declare
  t text;
begin
  foreach t in array array['categories','cakes','cake_photos','cake_flavours','cake_addons']
  loop
    execute format('drop policy if exists "%s public read"  on public.%I', t, t);
    execute format('drop policy if exists "%s public write" on public.%I', t, t);
  end loop;
end$$;

-- Anyone (even signed-out visitors) can READ the catalog.
create policy "categories public read"    on public.categories    for select using (true);
create policy "cakes public read"         on public.cakes         for select using (true);
create policy "cake_photos public read"   on public.cake_photos   for select using (true);
create policy "cake_flavours public read" on public.cake_flavours for select using (true);
create policy "cake_addons public read"   on public.cake_addons   for select using (true);

-- OPTION A (default) — the password-gated admin panel writes as the anon role,
-- so we allow anon + authenticated to INSERT / UPDATE / DELETE.
-- `for all` covers insert, update and delete in a single policy.
create policy "categories public write"    on public.categories    for all using (true) with check (true);
create policy "cakes public write"         on public.cakes         for all using (true) with check (true);
create policy "cake_photos public write"   on public.cake_photos   for all using (true) with check (true);
create policy "cake_flavours public write" on public.cake_flavours for all using (true) with check (true);
create policy "cake_addons public write"   on public.cake_addons   for all using (true) with check (true);

-- ---------------------------------------------------------------------------
--  GRANTS  (role-level permissions — RLS above still applies on top of these)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.categories    to anon, authenticated;
grant select, insert, update, delete on public.cakes         to anon, authenticated;
grant select, insert, update, delete on public.cake_photos   to anon, authenticated;
grant select, insert, update, delete on public.cake_flavours to anon, authenticated;
grant select, insert, update, delete on public.cake_addons   to anon, authenticated;

-- Cover any sequences (not strictly needed with uuid keys, but harmless) and
-- make future tables in this schema inherit the same grants.
grant usage, select on all sequences in schema public to anon, authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;

-- ---------------------------------------------------------------------------
--  STORAGE  — public bucket for cake photos uploaded from the admin panel
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('cake-photos', 'cake-photos', true)
on conflict (id) do nothing;

-- Reset the bucket policies so this script is re-runnable.
drop policy if exists "cake-photos public read"   on storage.objects;
drop policy if exists "cake-photos public upload"  on storage.objects;
drop policy if exists "cake-photos public update"  on storage.objects;
drop policy if exists "cake-photos public delete"  on storage.objects;

-- Anyone can view the images (needed so <img> tags load on the public site).
create policy "cake-photos public read"
  on storage.objects for select
  using (bucket_id = 'cake-photos');

-- The admin panel (anon role) can upload / replace / remove images.
create policy "cake-photos public upload"
  on storage.objects for insert
  with check (bucket_id = 'cake-photos');

create policy "cake-photos public update"
  on storage.objects for update
  using (bucket_id = 'cake-photos')
  with check (bucket_id = 'cake-photos');

create policy "cake-photos public delete"
  on storage.objects for delete
  using (bucket_id = 'cake-photos');

-- ---------------------------------------------------------------------------
--  OPTIONAL — seed a couple of rows so the catalog isn't empty on first load.
--  Delete this block if you'd rather start from scratch in the admin panel.
-- ---------------------------------------------------------------------------
do $$
declare
  cat_birthday uuid;
  cake_choco   uuid;
begin
  if not exists (select 1 from public.categories) then
    insert into public.categories (name, description, sort_order)
      values ('Birthday Cakes', 'Celebration cakes for every kind of birthday.', 1)
      returning id into cat_birthday;

    insert into public.cakes (category_id, name, description, per_pound_price, weight_kg, fixed_price, sort_order)
      values (cat_birthday, 'Classic Chocolate Truffle',
              'Rich chocolate sponge layered with silky truffle ganache.',
              450.00, 1.0, 600.00, 1)
      returning id into cake_choco;

    insert into public.cake_flavours (cake_id, name, price_delta, sort_order) values
      (cake_choco, 'Chocolate Truffle', 0, 1),
      (cake_choco, 'Belgian Dark',      100, 2),
      (cake_choco, 'Choco Hazelnut',    150, 3);

    insert into public.cake_addons (cake_id, name, price_delta, sort_order) values
      (cake_choco, 'Eggless',                0, 1),
      (cake_choco, 'Fresh flowers on top',  250, 2),
      (cake_choco, 'Custom message plaque',  120, 3);
  end if;
end$$;

-- ============================================================================
--  OPTION B — Lock writes behind Supabase Auth  (do this later for real security)
-- ============================================================================
--  Run the statements below ONLY when you want to require a logged-in admin
--  for any change. They replace the "public write" policies above.
--
--  1) Create an admin user in  Authentication → Users → Add user.
--  2) Then run:
--
--  -- remove the open write policies
--  drop policy if exists "categories public write"    on public.categories;
--  drop policy if exists "cakes public write"         on public.cakes;
--  drop policy if exists "cake_photos public write"   on public.cake_photos;
--  drop policy if exists "cake_flavours public write" on public.cake_flavours;
--  drop policy if exists "cake_addons public write"   on public.cake_addons;
--
--  -- only signed-in users may write
--  create policy "categories auth write"    on public.categories    for all to authenticated using (true) with check (true);
--  create policy "cakes auth write"         on public.cakes         for all to authenticated using (true) with check (true);
--  create policy "cake_photos auth write"   on public.cake_photos   for all to authenticated using (true) with check (true);
--  create policy "cake_flavours auth write" on public.cake_flavours for all to authenticated using (true) with check (true);
--  create policy "cake_addons auth write"   on public.cake_addons   for all to authenticated using (true) with check (true);
--
--  -- and remove anon write grants
--  revoke insert, update, delete on public.categories    from anon;
--  revoke insert, update, delete on public.cakes         from anon;
--  revoke insert, update, delete on public.cake_photos   from anon;
--  revoke insert, update, delete on public.cake_flavours from anon;
--  revoke insert, update, delete on public.cake_addons   from anon;
--
--  You would then switch the admin panel to sign in with
--  supabase.auth.signInWithPassword() instead of the client-side password.
-- ============================================================================
