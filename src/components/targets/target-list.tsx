"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { TargetWatch } from "@/types";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface TargetListProps {
  targets: TargetWatch[];
  onAdd: (data: Partial<TargetWatch>) => void;
  onRemove: (id: string) => void;
  onReorder: (targets: TargetWatch[]) => void;
}

export function TargetList({ targets, onAdd, onRemove, onReorder }: TargetListProps) {
  const [showForm, setShowForm] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [ref, setRef] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  function handleAdd() {
    if (!brand || !targetPrice) return;
    onAdd({
      brand,
      model,
      reference_number: ref,
      target_price: parseFloat(targetPrice),
      priority_order: targets.length + 1,
      notes: "",
    });
    setBrand("");
    setModel("");
    setRef("");
    setTargetPrice("");
    setShowForm(false);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const newTargets = [...targets];
    [newTargets[index - 1], newTargets[index]] = [newTargets[index], newTargets[index - 1]];
    newTargets.forEach((t, i) => (t.priority_order = i + 1));
    onReorder(newTargets);
  }

  function moveDown(index: number) {
    if (index === targets.length - 1) return;
    const newTargets = [...targets];
    [newTargets[index], newTargets[index + 1]] = [newTargets[index + 1], newTargets[index]];
    newTargets.forEach((t, i) => (t.priority_order = i + 1));
    onReorder(newTargets);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Target Watches</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-3 w-3" />
          Add Target
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="rounded-md border border-zinc-200 p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Brand</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Omega" />
              </div>
              <div>
                <Label className="text-xs">Model</Label>
                <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Speedmaster" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Reference</Label>
                <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="310.30.42.50.01.001" />
              </div>
              <div>
                <Label className="text-xs">Target Price ($)</Label>
                <Input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {targets.length === 0 ? (
          <p className="text-sm text-zinc-500">No target watches yet.</p>
        ) : (
          <div className="space-y-2">
            {targets.map((target, i) => (
              <div
                key={target.id}
                className="flex items-center justify-between rounded-md border border-zinc-100 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      className="text-zinc-400 hover:text-zinc-600 text-xs"
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                    >
                      ▲
                    </button>
                    <button
                      className="text-zinc-400 hover:text-zinc-600 text-xs"
                      onClick={() => moveDown(i)}
                      disabled={i === targets.length - 1}
                    >
                      ▼
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      #{target.priority_order} — {target.brand} {target.model}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono">{target.reference_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{formatCurrency(target.target_price)}</p>
                  <Button variant="ghost" size="icon" onClick={() => onRemove(target.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
