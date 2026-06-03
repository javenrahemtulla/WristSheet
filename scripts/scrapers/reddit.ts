import {
  getSupabaseAdmin,
  getReferenceNumbers,
  startScrapeRun,
  completeScrapeRun,
  sleep,
  randomUserAgent,
} from "./lib";

const SUBREDDITS = ["Watches", "Rolex", "rolex", "WatchExchange"];
const AD_KEYWORDS = ["AD", "waitlist", "authorized dealer", "grey", "allocation", "wait list"];

interface RedditPost {
  title: string;
  selftext: string;
  url: string;
  author: string;
  created_utc: number;
}

function classifySentiment(text: string): "easy" | "moderate" | "hard" | "allocation_only" {
  const lower = text.toLowerCase();
  if (lower.includes("allocation only") || lower.includes("years on the waitlist") || lower.includes("impossible"))
    return "allocation_only";
  if (lower.includes("hard") || lower.includes("difficult") || lower.includes("long wait"))
    return "hard";
  if (lower.includes("easy") || lower.includes("no wait") || lower.includes("walked in"))
    return "easy";
  return "moderate";
}

async function searchSubreddit(subreddit: string, ref: string): Promise<RedditPost[]> {
  const query = `${ref} ${AD_KEYWORDS.slice(0, 3).join(" OR ")}`;
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=new&limit=10`;

  const response = await fetch(url, {
    headers: { "User-Agent": randomUserAgent() },
  });

  if (!response.ok) return [];

  const data = await response.json();
  return (data?.data?.children ?? []).map((c: { data: RedditPost }) => c.data);
}

async function main() {
  const supabase = getSupabaseAdmin();
  const refs = await getReferenceNumbers(supabase);
  if (refs.length === 0) return;

  const runId = await startScrapeRun(supabase, "reddit");
  let scraped = 0;
  let errors = 0;

  for (const ref of refs) {
    try {
      console.log(`Searching Reddit for AD signals on ${ref}...`);

      for (const sub of SUBREDDITS) {
        const posts = await searchSubreddit(sub, ref);

        const signals = posts
          .filter((p) => {
            const text = `${p.title} ${p.selftext}`.toLowerCase();
            return AD_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
          })
          .map((p) => {
            const text = `${p.title} ${p.selftext}`;
            const quoteStart = text.substring(0, 300);
            return {
              reference_number: ref,
              source_url: p.url,
              sentiment: classifySentiment(text),
              quote_text: quoteStart + (text.length > 300 ? "..." : ""),
              author: p.author,
              posted_at: new Date(p.created_utc * 1000).toISOString(),
            };
          });

        if (signals.length > 0) {
          await supabase.from("ad_difficulty_signals").insert(signals);
        }

        await sleep(2000);
      }

      scraped++;
    } catch (err) {
      console.error(`Error searching Reddit for ${ref}:`, err);
      errors++;
    }
  }

  await completeScrapeRun(supabase, runId, scraped, errors);
  console.log(`Reddit scrape complete: ${scraped} refs, ${errors} errors`);
}

main().catch(console.error);
