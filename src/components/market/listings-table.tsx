"use client";

import { formatCurrency } from "@/lib/utils";
import type { MarketPrice } from "@/types";
import { ExternalLink } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  chrono24: "Chrono24",
  bobs: "Bob's Watches",
  watchguys: "WatchGuys",
  happy: "Happy Jewelers",
  reddit: "Reddit",
};

export function ListingsTable({ prices }: { prices: MarketPrice[] }) {
  if (prices.length === 0) return null;

  const active = prices.filter((p) => p.listing_status === "active");
  const sorted = [...active].sort((a, b) => a.price - b.price);

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Source</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Price</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Condition</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Scraped</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {sorted.map((p) => (
            <tr key={p.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3">{SOURCE_LABELS[p.source] ?? p.source}</td>
              <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.price)}</td>
              <td className="px-4 py-3 text-zinc-500">{p.condition ?? "—"}</td>
              <td className="px-4 py-3 text-zinc-500">
                {new Date(p.scraped_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                {p.listing_url && (
                  <a
                    href={p.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
