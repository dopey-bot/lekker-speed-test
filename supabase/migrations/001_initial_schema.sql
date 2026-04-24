-- Lekker Speed Test — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

-- =====================================================================
-- Tables
-- =====================================================================

create table if not exists public.slogans (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  language text not null check (language in (
    'en','af','zu','xh','st','ts','tn','nr','ss','ve','nso'
  )),
  topic text,
  speed_bucket_min_mbps numeric not null default 0,
  speed_bucket_max_mbps numeric not null default 999999,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists slogans_active_bucket_idx
  on public.slogans (active, speed_bucket_min_mbps, speed_bucket_max_mbps);

create table if not exists public.slogan_suggestions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  language text not null,
  topic text,
  suggested_bucket text,
  submitter_ip_hash text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  download_mbps numeric not null,
  upload_mbps numeric not null,
  ping_ms numeric not null,
  jitter_ms numeric,
  slogan_id uuid references public.slogans(id) on delete set null,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  link_url text not null,
  placement text not null check (placement in ('desktop_left','desktop_right','mobile')),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ads_active_placement_idx
  on public.ads (active, placement);

create table if not exists public.advertiser_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row-Level Security
-- =====================================================================

alter table public.slogans enable row level security;
alter table public.slogan_suggestions enable row level security;
alter table public.test_results enable row level security;
alter table public.ads enable row level security;
alter table public.advertiser_enquiries enable row level security;

drop policy if exists "Public read active slogans" on public.slogans;
create policy "Public read active slogans"
  on public.slogans for select
  using (active = true);

drop policy if exists "Public read active ads" on public.ads;
create policy "Public read active ads"
  on public.ads for select
  using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists "Public insert suggestion" on public.slogan_suggestions;
create policy "Public insert suggestion"
  on public.slogan_suggestions for insert
  with check (true);

drop policy if exists "Public insert test result" on public.test_results;
create policy "Public insert test result"
  on public.test_results for insert
  with check (true);

drop policy if exists "Public read test result" on public.test_results;
create policy "Public read test result"
  on public.test_results for select
  using (true);

drop policy if exists "Public insert enquiry" on public.advertiser_enquiries;
create policy "Public insert enquiry"
  on public.advertiser_enquiries for insert
  with check (true);

drop policy if exists "Admin all slogans" on public.slogans;
create policy "Admin all slogans" on public.slogans
  for all to authenticated using (true) with check (true);

drop policy if exists "Admin all suggestions" on public.slogan_suggestions;
create policy "Admin all suggestions" on public.slogan_suggestions
  for all to authenticated using (true) with check (true);

drop policy if exists "Admin all test_results" on public.test_results;
create policy "Admin all test_results" on public.test_results
  for all to authenticated using (true) with check (true);

drop policy if exists "Admin all ads" on public.ads;
create policy "Admin all ads" on public.ads
  for all to authenticated using (true) with check (true);

drop policy if exists "Admin all enquiries" on public.advertiser_enquiries;
create policy "Admin all enquiries" on public.advertiser_enquiries
  for all to authenticated using (true) with check (true);

-- =====================================================================
-- Storage bucket for ad banner images
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('ad-banners', 'ad-banners', true)
on conflict (id) do nothing;

drop policy if exists "Public read ad banners" on storage.objects;
create policy "Public read ad banners"
  on storage.objects for select
  using (bucket_id = 'ad-banners');

drop policy if exists "Admin write ad banners" on storage.objects;
create policy "Admin write ad banners"
  on storage.objects for all to authenticated
  using (bucket_id = 'ad-banners') with check (bucket_id = 'ad-banners');