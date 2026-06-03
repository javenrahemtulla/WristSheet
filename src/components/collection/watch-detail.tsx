"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { calculateDepreciationCurve } from "@/lib/financial/depreciation";
import { calculateLiquidation } from "@/lib/financial/liquidation";
import type { Watch } from "@/types";

export function WatchDetail({ watch }: { watch: Watch }) {
  const depreciationCurve = useMemo(
    () =>
      calculateDepreciationCurve(
        watch.purchase_price,
        watch.current_value,
        watch.purchase_date
      ),
    [watch]
  );

  const liquidation = useMemo(
    () => calculateLiquidation(watch.current_value),
    [watch.current_value]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {watch.brand} {watch.model}
          </h2>
          <p className="font-mono text-sm text-zinc-500">
            {watch.reference_number}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">
            {formatCurrency(watch.current_value)}
          </p>
          <p
            className={`text-sm font-medium ${
              watch.current_value >= watch.purchase_price
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {watch.current_value >= watch.purchase_price ? "+" : ""}
            {formatCurrency(watch.current_value - watch.purchase_price)} from{" "}
            {formatCurrency(watch.purchase_price)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projected Value</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={depreciationCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="year"
                tickFormatter={(y) => `Yr ${y}`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Value"]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#18181b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liquidation Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {liquidation.map((scenario) => (
              <div
                key={scenario.channel}
                className="flex items-center justify-between rounded-md border border-zinc-100 p-3"
              >
                <div>
                  <p className="font-medium">{scenario.label}</p>
                  <p className="text-sm text-zinc-500">
                    ~{(scenario.feePercent * 100).toFixed(0)}% fees
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  {formatCurrency(scenario.netProceeds)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
