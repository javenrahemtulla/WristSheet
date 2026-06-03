"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { MarketPrice } from "@/types";

const SOURCE_COLORS: Record<string, string> = {
  chrono24: "#1e40af",
  bobs: "#b45309",
  watchguys: "#059669",
  happy: "#7c3aed",
  reddit: "#dc2626",
};

export function PriceChart({ prices }: { prices: MarketPrice[] }) {
  if (prices.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-zinc-500">No price data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...prices].sort(
    (a, b) => new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime()
  );

  const chartData = sorted.map((p) => ({
    date: new Date(p.scraped_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: p.price,
    source: p.source,
  }));

  const sources = [...new Set(prices.map((p) => p.source))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#18181b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
