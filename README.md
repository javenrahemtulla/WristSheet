# WristSheet

Watch portfolio intelligence — financial modeling, purchase planning, and grey market data for watch collectors.

## Features

- **Collection Management** — Track watches with purchase price, current value, and condition. See total cost basis, current value, P&L, and collection IRR at a glance.
- **Financial Modeling** — Depreciation projections, liquidation scenarios (Chrono24, dealer buyback, private sale), and "What If" scenario planning.
- **Purchase Timeline** — Input your finances and target watches. Get projected purchase dates based on savings rate and priority order.
- **Market Intelligence** — Search any reference number for scraped grey market prices, price distribution stats, trend analysis, and active listings across sources.
- **AD Difficulty Ratings** — Aggregated authorized dealer difficulty scores from Reddit discussion.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Database:** Supabase (Postgres + Auth + RLS)
- **Charts:** Recharts
- **Scraping:** GitHub Actions cron + cheerio
- **Deployment:** Vercel

## Getting Started

### 1. Supabase Setup

Create a [Supabase](https://supabase.com) project and run the migration:

```sql
-- Run the contents of supabase/migrations/001_initial_schema.sql
-- in the Supabase SQL Editor
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
# Fill in your Supabase project URL and anon key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Scraper Setup (Optional)

Add these secrets to your GitHub repository for automated daily scraping:

- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key

The scrape workflow runs daily at 2am UTC. You can also trigger it manually from the Actions tab.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login/signup
│   ├── collection/         # Portfolio modeler
│   ├── targets/            # Purchase timeline planner
│   └── market/             # Market intelligence search
├── components/
│   ├── ui/                 # Reusable UI primitives
│   ├── collection/         # Portfolio components
│   ├── targets/            # Timeline components
│   └── market/             # Market intel components
├── lib/
│   ├── supabase/           # Client + server helpers
│   ├── financial/          # IRR, depreciation, liquidation, timeline
│   └── market/             # Price trends and stats
├── types/                  # Shared TypeScript types
scripts/
└── scrapers/               # Chrono24, Bob's, Reddit scrapers
supabase/
└── migrations/             # SQL schema
```
