-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Watches (user's collection)
create table watches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  brand text not null,
  model text not null,
  reference_number text not null,
  purchase_price numeric not null,
  purchase_date date not null,
  current_value numeric not null,
  condition text not null default 'very_good',
  notes text default '',
  created_at timestamptz default now()
);

alter table watches enable row level security;
create policy "Users can manage their own watches"
  on watches for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Watch references (canonical data)
create table watch_references (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  reference_number text not null unique,
  retail_msrp numeric,
  movement text,
  case_size text,
  case_material text,
  created_at timestamptz default now()
);

alter table watch_references enable row level security;
create policy "Anyone can read watch references"
  on watch_references for select
  using (true);
create policy "Service role can manage watch references"
  on watch_references for all
  using (true)
  with check (true);

-- Market prices (scraped data)
create table market_prices (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null,
  source text not null,
  price numeric not null,
  currency text not null default 'USD',
  condition text,
  listing_url text,
  scraped_at timestamptz not null default now(),
  listing_status text not null default 'active'
);

alter table market_prices enable row level security;
create policy "Authenticated users can read market prices"
  on market_prices for select
  using (auth.role() = 'authenticated');
create policy "Service role can manage market prices"
  on market_prices for all
  using (true)
  with check (true);

create index idx_market_prices_reference on market_prices(reference_number);
create index idx_market_prices_scraped on market_prices(scraped_at desc);

-- Target watches
create table target_watches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  reference_number text not null,
  brand text not null default '',
  model text not null default '',
  target_price numeric not null,
  priority_order int not null default 1,
  notes text default '',
  created_at timestamptz default now()
);

alter table target_watches enable row level security;
create policy "Users can manage their own targets"
  on target_watches for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User financials
create table user_financials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  monthly_income numeric not null default 0,
  weekly_savings_rate numeric not null default 0.2,
  investment_allocation numeric not null default 0,
  misc_budget numeric not null default 0,
  current_savings numeric not null default 0,
  updated_at timestamptz default now()
);

alter table user_financials enable row level security;
create policy "Users can manage their own financials"
  on user_financials for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- AD difficulty signals
create table ad_difficulty_signals (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null,
  source_url text not null default '',
  sentiment text not null,
  quote_text text not null,
  author text not null default '',
  posted_at timestamptz not null default now(),
  scraped_at timestamptz not null default now()
);

alter table ad_difficulty_signals enable row level security;
create policy "Authenticated users can read AD signals"
  on ad_difficulty_signals for select
  using (auth.role() = 'authenticated');
create policy "Service role can manage AD signals"
  on ad_difficulty_signals for all
  using (true)
  with check (true);

create index idx_ad_signals_reference on ad_difficulty_signals(reference_number);

-- Scrape runs (job tracking)
create table scrape_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null default 'running',
  references_scraped int not null default 0,
  errors int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table scrape_runs enable row level security;
create policy "Service role can manage scrape runs"
  on scrape_runs for all
  using (true)
  with check (true);
