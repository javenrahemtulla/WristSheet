import * as cheerio from "cheerio";
import {
  getSupabaseAdmin,
  getReferenceNumbers,
  startScrapeRun,
  completeScrapeRun,
  sleep,
  randomUserAgent,
} from "./lib";

interface Listing {
  price: number;
  currency: string;
  condition: string | null;
  listing_url: string;
}

async function scrapeReference(ref: string): Promise<Listing[]> {
  const url = `https://www.chrono24.com/search/index.htm?query=${encodeURIComponent(ref)}&dosearch=true&searchexplain=false&sortorder=0`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": randomUserAgent(),
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    console.error(`Chrono24 returned ${response.status} for ${ref}`);
    return [];
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const listings: Listing[] = [];

  $(".article-item-container").each((_, el) => {
    const priceText = $(el).find(".text-bold").first().text().trim();
    const priceMatch = priceText.replace(/[^0-9.,]/g, "").replace(",", "");
    const price = parseFloat(priceMatch);
    if (isNaN(price) || price === 0) return;

    const link = $(el).find("a[href*='/']").first().attr("href") ?? "";
    const conditionText = $(el).find(".text-sm").text().toLowerCase();
    let condition: string | null = null;
    if (conditionText.includes("new")) condition = "new";
    else if (conditionText.includes("unworn")) condition = "unworn";
    else if (conditionText.includes("very good")) condition = "very_good";
    else if (conditionText.includes("good")) condition = "good";

    listings.push({
      price,
      currency: "USD",
      condition,
      listing_url: link.startsWith("http")
        ? link
        : `https://www.chrono24.com${link}`,
    });
  });

  return listings;
}

async function main() {
  const supabase = getSupabaseAdmin();
  const refs = await getReferenceNumbers(supabase);

  if (refs.length === 0) {
    console.log("No reference numbers to scrape");
    return;
  }

  const runId = await startScrapeRun(supabase, "chrono24");
  let scraped = 0;
  let errors = 0;

  for (const ref of refs) {
    try {
      console.log(`Scraping Chrono24 for ${ref}...`);
      const listings = await scrapeReference(ref);

      if (listings.length > 0) {
        const rows = listings.map((l) => ({
          reference_number: ref,
          source: "chrono24",
          price: l.price,
          currency: l.currency,
          condition: l.condition,
          listing_url: l.listing_url,
          listing_status: "active",
        }));
        await supabase.from("market_prices").insert(rows);
      }

      scraped++;
      await sleep(3000 + Math.random() * 2000);
    } catch (err) {
      console.error(`Error scraping ${ref}:`, err);
      errors++;
    }
  }

  await completeScrapeRun(supabase, runId, scraped, errors, errors > refs.length / 2);
  console.log(`Chrono24 scrape complete: ${scraped} refs, ${errors} errors`);
}

main().catch(console.error);
