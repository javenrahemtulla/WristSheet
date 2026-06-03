"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { UserFinancials } from "@/types";

interface FinancialsFormProps {
  financials: UserFinancials | null;
  onSave: (data: Partial<UserFinancials>) => void;
  loading?: boolean;
}

export function FinancialsForm({ financials, onSave, loading }: FinancialsFormProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(
    financials?.monthly_income?.toString() ?? ""
  );
  const [weeklySavingsRate, setWeeklySavingsRate] = useState(
    financials?.weekly_savings_rate?.toString() ?? "0.2"
  );
  const [currentSavings, setCurrentSavings] = useState(
    financials?.current_savings?.toString() ?? "0"
  );

  function handleSave() {
    onSave({
      monthly_income: parseFloat(monthlyIncome) || 0,
      weekly_savings_rate: parseFloat(weeklySavingsRate) || 0,
      current_savings: parseFloat(currentSavings) || 0,
      investment_allocation: 0,
      misc_budget: 0,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your Finances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Monthly Income ($)</Label>
            <Input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="5000"
            />
          </div>
          <div className="space-y-2">
            <Label>Savings Rate (0-1)</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={weeklySavingsRate}
              onChange={(e) => setWeeklySavingsRate(e.target.value)}
              placeholder="0.2"
            />
          </div>
          <div className="space-y-2">
            <Label>Current Savings ($)</Label>
            <Input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <Button size="sm" onClick={handleSave} disabled={loading}>
          Save Finances
        </Button>
      </CardContent>
    </Card>
  );
}
