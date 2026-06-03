"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Watch, WatchCondition } from "@/types";

interface WatchFormProps {
  watch?: Watch;
  onSubmit: (data: Omit<Watch, "id" | "user_id" | "created_at">) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CONDITIONS: { value: WatchCondition; label: string }[] = [
  { value: "new", label: "New / Sealed" },
  { value: "unworn", label: "Unworn" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

export function WatchForm({ watch, onSubmit, onCancel, loading }: WatchFormProps) {
  const [brand, setBrand] = useState(watch?.brand ?? "");
  const [model, setModel] = useState(watch?.model ?? "");
  const [referenceNumber, setReferenceNumber] = useState(watch?.reference_number ?? "");
  const [purchasePrice, setPurchasePrice] = useState(watch?.purchase_price?.toString() ?? "");
  const [currentValue, setCurrentValue] = useState(watch?.current_value?.toString() ?? "");
  const [purchaseDate, setPurchaseDate] = useState(watch?.purchase_date ?? "");
  const [condition, setCondition] = useState<WatchCondition>(watch?.condition ?? "very_good");
  const [notes, setNotes] = useState(watch?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      brand,
      model,
      reference_number: referenceNumber,
      purchase_price: parseFloat(purchasePrice),
      current_value: parseFloat(currentValue),
      purchase_date: purchaseDate,
      condition,
      notes,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Rolex" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Submariner" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ref">Reference Number</Label>
        <Input id="ref" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="126610LN" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase-price">Purchase Price ($)</Label>
          <Input id="purchase-price" type="number" min="0" step="1" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-value">Current Value ($)</Label>
          <Input id="current-value" type="number" min="0" step="1" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase-date">Purchase Date</Label>
          <Input id="purchase-date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as WatchCondition)}>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{watch ? "Update" : "Add Watch"}</Button>
      </div>
    </form>
  );
}
