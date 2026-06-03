"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface PriceStatsProps {
  stats: {
    count: number;
    min: number;
    max: number;
    median: number;
    mean: number;
  } | null;
  trend: {
    direction: "up" | "down" | "flat";
    projectedPrice: number;
  } | null;
}

export function PriceStats({ stats, trend }: PriceStatsProps) {
  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-zinc-500">Listings</p>
          <p className="text-xl font-semibold">{stats.count}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-zinc-500">Median</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.median)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-zinc-500">Range</p>
          <p className="text-xl font-semibold">
            {formatCurrency(stats.min)} – {formatCurrency(stats.max)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-zinc-500">Average</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.mean)}</p>
        </CardContent>
      </Card>
      {trend && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">30-Day Projection</p>
            <div className="flex items-center gap-1">
              {trend.direction === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : trend.direction === "down" ? (
                <ArrowDown className="h-4 w-4 text-red-600" />
              ) : (
                <Minus className="h-4 w-4 text-zinc-400" />
              )}
              <p className="text-xl font-semibold">
                {formatCurrency(trend.projectedPrice)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
