"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SummaryCards } from "./summary-cards";
import { formatCurrency } from "@/lib/utils";
import { whatIfAddWatch, whatIfRemoveWatch, calculateCollectionSummary } from "@/lib/financial/whatif";
import type { Watch, CollectionSummary } from "@/types";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface WhatIfPanelProps {
  watches: Watch[];
}

interface HypotheticalWatch {
  brand: string;
  model: string;
  purchasePrice: string;
  currentValue: string;
}

export function WhatIfPanel({ watches }: WhatIfPanelProps) {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [hypotheticals, setHypotheticals] = useState<HypotheticalWatch[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWatch, setNewWatch] = useState<HypotheticalWatch>({
    brand: "",
    model: "",
    purchasePrice: "",
    currentValue: "",
  });

  const baseWatches = watches.filter((w) => !removedIds.has(w.id));
  const hypoWatches: Watch[] = hypotheticals.map((h, i) => ({
    id: `hypo-${i}`,
    user_id: "",
    brand: h.brand,
    model: h.model,
    reference_number: "HYPOTHETICAL",
    purchase_price: parseFloat(h.purchasePrice) || 0,
    current_value: parseFloat(h.currentValue) || 0,
    purchase_date: new Date().toISOString().split("T")[0],
    condition: "new" as const,
    notes: "",
    created_at: "",
  }));

  const allWatches = [...baseWatches, ...hypoWatches];
  const whatIfSummary = calculateCollectionSummary(allWatches);
  const baseSummary = calculateCollectionSummary(watches);

  function addHypothetical() {
    if (!newWatch.brand || !newWatch.purchasePrice) return;
    setHypotheticals([...hypotheticals, { ...newWatch }]);
    setNewWatch({ brand: "", model: "", purchasePrice: "", currentValue: "" });
    setShowAddForm(false);
  }

  function reset() {
    setRemovedIds(new Set());
    setHypotheticals([]);
  }

  const hasChanges = removedIds.size > 0 || hypotheticals.length > 0;
  const pnlDiff = whatIfSummary.totalPnL - baseSummary.totalPnL;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">What If Scenario</h3>
        {hasChanges && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <SummaryCards summary={whatIfSummary} />

      {hasChanges && (
        <p className="text-sm text-zinc-500">
          Net impact:{" "}
          <span className={pnlDiff >= 0 ? "text-green-600" : "text-red-600"}>
            {pnlDiff >= 0 ? "+" : ""}{formatCurrency(pnlDiff)}
          </span>{" "}
          vs current portfolio
        </p>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Watches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {watches.map((w) => (
            <div
              key={w.id}
              className={`flex items-center justify-between rounded-md p-2 ${
                removedIds.has(w.id) ? "bg-red-50 line-through opacity-50" : ""
              }`}
            >
              <span className="text-sm">
                {w.brand} {w.model} — {formatCurrency(w.current_value)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const next = new Set(removedIds);
                  if (next.has(w.id)) next.delete(w.id);
                  else next.add(w.id);
                  setRemovedIds(next);
                }}
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {hypotheticals.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md bg-blue-50 p-2"
            >
              <span className="text-sm">
                {h.brand} {h.model} — {formatCurrency(parseFloat(h.currentValue) || 0)}{" "}
                <span className="text-xs text-blue-600">(hypothetical)</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setHypotheticals(hypotheticals.filter((_, j) => j !== i))
                }
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {showAddForm ? (
        <Card>
          <CardContent className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Brand</Label>
                <Input
                  value={newWatch.brand}
                  onChange={(e) => setNewWatch({ ...newWatch, brand: e.target.value })}
                  placeholder="Rolex"
                />
              </div>
              <div>
                <Label className="text-xs">Model</Label>
                <Input
                  value={newWatch.model}
                  onChange={(e) => setNewWatch({ ...newWatch, model: e.target.value })}
                  placeholder="Daytona"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Purchase Price ($)</Label>
                <Input
                  type="number"
                  value={newWatch.purchasePrice}
                  onChange={(e) => setNewWatch({ ...newWatch, purchasePrice: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Current Value ($)</Label>
                <Input
                  type="number"
                  value={newWatch.currentValue}
                  onChange={(e) => setNewWatch({ ...newWatch, currentValue: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addHypothetical}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-1 h-3 w-3" />
          Add Hypothetical Watch
        </Button>
      )}
    </div>
  );
}
