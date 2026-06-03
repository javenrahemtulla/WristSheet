"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceChart } from "@/components/market/price-chart";
import { PriceStats } from "@/components/market/price-stats";
import { AdDifficulty } from "@/components/market/ad-difficulty";
import { ListingsTable } from "@/components/market/listings-table";
import { calculateTrend, calculatePriceStats } from "@/lib/market/trends";
import type { MarketPrice, AdDifficultySignal } from "@/types";
import { Search } from "lucide-react";

export default function MarketPage() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [adSignals, setAdSignals] = useState<AdDifficultySignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const [{ data: priceData }, { data: adData }] = await Promise.all([
      supabase
        .from("market_prices")
        .select("*")
        .ilike("reference_number", `%${query.trim()}%`)
        .order("scraped_at", { ascending: false })
        .limit(200),
      supabase
        .from("ad_difficulty_signals")
        .select("*")
        .ilike("reference_number", `%${query.trim()}%`)
        .order("posted_at", { ascending: false })
        .limit(20),
    ]);

    setPrices(priceData ?? []);
    setAdSignals(adData ?? []);
    setLoading(false);
  }, [query, supabase]);

  const stats = calculatePriceStats(prices);
  const trend = calculateTrend(prices);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Market Intelligence</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference number (e.g. 126610LN)"
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {searched && !loading && prices.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center">
          <p className="text-zinc-500">
            No market data found for &ldquo;{query}&rdquo;.
          </p>
          <p className="text-sm text-zinc-400">
            Data populates automatically from daily scraping runs.
          </p>
        </div>
      )}

      {prices.length > 0 && (
        <>
          <PriceStats stats={stats} trend={trend} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PriceChart prices={prices} />
            </div>
            <AdDifficulty signals={adSignals} />
          </div>
          <ListingsTable prices={prices} />
        </>
      )}
    </div>
  );
}
