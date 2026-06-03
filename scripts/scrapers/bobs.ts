import * as cheerio from "cheerio";
import {
  getSupabaseAdmin,
  getReferenceNumbers,
  startScrapeRun,
  completeScrapeRun,
  sleep,
  randomUserAgent,
} from "./lib";

async function scrapeReference(ref: string) {
  const url = `https://www.bobswatches.com/search?q=${encodeURIComponent(ref)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": randomUserAgent(),
      Accept: "text/html",
    },
  });

  if (!response.ok) return [];

  const html = await response.text();
  const $ = cheerio.load(html);
  const listings: Array<{
    price: number;
    listing_url: string;
    condition: string | null;
  }> = [];

  $(".product-card, .product-item, [data-product]").each((_, el) => {
    const priceText = $(el).find(".price, .product-price").first().text();
    const priceMatch = priceText.replace(/[^0-9.]/g, "");
    const price = parseFloat(priceMatch);
    if (isNaN(price) || price === 0) return;

    const link = $(el).find("a").first().attr("href") ?? "";

    listings.push({
      price,
      listing_url: link.startsWith("http")
        ? link
        : `https://www.bobswatches.com${link}`,
      condition: null,
    });
  });

  return listings;
}

async function main() {
  const supabase = getSupabaseAdmin();
  const refs = await getReferenceNumbers(supabase);
  if (refs.length === 0) return;

  const runId = await startScrapeRun(supabase, "bobs");
  let scraped = 0;
  let errors = 0;

  for (const ref of refs) {
    try {
      console.log(`Scraping Bob's for ${ref}...`);
      const listings = await scrapeReference(ref);

      if (listings.length > 0) {
        const rows = listings.map((l) => ({
          reference_number: ref,
          source: "bobs",
          price: l.price,
          currency: "USD",
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

  await completeScrapeRun(supabase, runId, scraped, errors);
  console.log(`Bob's scrape complete: ${scraped} refs, ${errors} errors`);
}

main().catch(console.error);
