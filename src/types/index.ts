export interface Watch {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  reference_number: string;
  purchase_price: number;
  purchase_date: string;
  current_value: number;
  condition: WatchCondition;
  notes: string;
  created_at: string;
}

export type WatchCondition =
  | "new"
  | "unworn"
  | "very_good"
  | "good"
  | "fair";

export interface WatchReference {
  id: string;
  brand: string;
  model: string;
  reference_number: string;
  retail_msrp: number | null;
  movement: string | null;
  case_size: string | null;
  case_material: string | null;
  created_at: string;
}

export interface MarketPrice {
  id: string;
  reference_number: string;
  source: MarketSource;
  price: number;
  currency: string;
  condition: string | null;
  listing_url: string | null;
  scraped_at: string;
  listing_status: "active" | "sold";
}

export type MarketSource =
  | "chrono24"
  | "bobs"
  | "watchguys"
  | "happy"
  | "reddit";

export interface TargetWatch {
  id: string;
  user_id: string;
  reference_number: string;
  brand: string;
  model: string;
  target_price: number;
  priority_order: number;
  notes: string;
  created_at: string;
}

export interface UserFinancials {
  id: string;
  user_id: string;
  monthly_income: number;
  weekly_savings_rate: number;
  investment_allocation: number;
  misc_budget: number;
  current_savings: number;
  updated_at: string;
}

export interface AdDifficultySignal {
  id: string;
  reference_number: string;
  source_url: string;
  sentiment: "easy" | "moderate" | "hard" | "allocation_only";
  quote_text: string;
  author: string;
  posted_at: string;
  scraped_at: string;
}

export interface ScrapeRun {
  id: string;
  source: MarketSource;
  status: "running" | "completed" | "failed";
  references_scraped: number;
  errors: number;
  started_at: string;
  completed_at: string | null;
}

export interface LiquidationScenario {
  channel: "chrono24" | "dealer_buyback" | "private_sale";
  label: string;
  feePercent: number;
  netProceeds: number;
}

export interface TimelineEntry {
  target: TargetWatch;
  projectedDate: Date;
  weeksToSave: number;
  cumulativeSavings: number;
}

export interface CollectionSummary {
  totalCostBasis: number;
  totalCurrentValue: number;
  totalPnL: number;
  collectionIRR: number;
}
