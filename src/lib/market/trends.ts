import type { MarketPrice } from "@/types";

interface TrendResult {
  slope: number;
  intercept: number;
  rSquared: number;
  projectedPrice: number;
  direction: "up" | "down" | "flat";
}

export function calculateTrend(prices: MarketPrice[]): TrendResult | null {
  if (prices.length < 3) return null;

  const sorted = [...prices].sort(
    (a, b) => new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime()
  );

  const firstTime = new Date(sorted[0].scraped_at).getTime();
  const xs = sorted.map(
    (p) => (new Date(p.scraped_at).getTime() - firstTime) / (1000 * 60 * 60 * 24)
  );
  const ys = sorted.map((p) => p.price);

  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumXX = xs.reduce((a, x) => a + x * x, 0);

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const meanY = sumY / n;
  const ssRes = ys.reduce((a, y, i) => a + Math.pow(y - (slope * xs[i] + intercept), 2), 0);
  const ssTot = ys.reduce((a, y) => a + Math.pow(y - meanY, 2), 0);
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  const lastDay = xs[xs.length - 1];
  const projectedPrice = slope * (lastDay + 30) + intercept;

  const dailyChangePercent = Math.abs(slope) / meanY;
  const direction =
    dailyChangePercent < 0.001 ? "flat" : slope > 0 ? "up" : "down";

  return { slope, intercept, rSquared, projectedPrice: Math.round(projectedPrice), direction };
}

export function calculatePriceStats(prices: MarketPrice[]) {
  if (prices.length === 0) return null;

  const values = prices.map((p) => p.price).sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);

  return {
    count: values.length,
    min: values[0],
    max: values[values.length - 1],
    median: values[Math.floor(values.length / 2)],
    mean: Math.round(sum / values.length),
  };
}
