"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { CollectionSummary } from "@/types";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

export function SummaryCards({ summary }: { summary: CollectionSummary }) {
  const isPositive = summary.totalPnL >= 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <DollarSign className="h-4 w-4" />
            Cost Basis
          </div>
          <p className="mt-1 text-2xl font-semibold">
            {formatCurrency(summary.totalCostBasis)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <DollarSign className="h-4 w-4" />
            Current Value
          </div>
          <p className="mt-1 text-2xl font-semibold">
            {formatCurrency(summary.totalCurrentValue)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            Total P&L
          </div>
          <p
            className={`mt-1 text-2xl font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatCurrency(summary.totalPnL)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Percent className="h-4 w-4" />
            Collection IRR
          </div>
          <p
            className={`mt-1 text-2xl font-semibold ${
              summary.collectionIRR >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {summary.collectionIRR >= 0 ? "+" : ""}
            {formatPercent(summary.collectionIRR)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
