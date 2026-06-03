import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

export async function getReferenceNumbers(
  supabase: AnySupabaseClient
): Promise<string[]> {
  const { data: watches } = await supabase
    .from("watches")
    .select("reference_number");
  const { data: targets } = await supabase
    .from("target_watches")
    .select("reference_number");

  const refs = new Set<string>();
  watches?.forEach((w) => refs.add(w.reference_number));
  targets?.forEach((t) => refs.add(t.reference_number));
  return [...refs];
}

export async function startScrapeRun(
  supabase: AnySupabaseClient,
  source: string
) {
  const { data } = await supabase
    .from("scrape_runs")
    .insert({ source, status: "running" })
    .select()
    .single();
  return data!.id;
}

export async function completeScrapeRun(
  supabase: AnySupabaseClient,
  runId: string,
  refsScraped: number,
  errors: number,
  failed: boolean = false
) {
  await supabase
    .from("scrape_runs")
    .update({
      status: failed ? "failed" : "completed",
      references_scraped: refsScraped,
      errors,
      completed_at: new Date().toISOString(),
    })
    .eq("id", runId);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

export function randomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}
