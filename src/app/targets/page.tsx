"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FinancialsForm } from "@/components/targets/financials-form";
import { TargetList } from "@/components/targets/target-list";
import { TimelineView } from "@/components/targets/timeline-view";
import { calculateTimeline } from "@/lib/financial/timeline";
import type { TargetWatch, UserFinancials, TimelineEntry } from "@/types";

export default function TargetsPage() {
  const supabase = createClient();
  const [targets, setTargets] = useState<TargetWatch[]>([]);
  const [financials, setFinancials] = useState<UserFinancials | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: targetsData }, { data: financialsData }] = await Promise.all([
      supabase.from("target_watches").select("*").order("priority_order"),
      supabase.from("user_financials").select("*").limit(1).single(),
    ]);
    if (targetsData) setTargets(targetsData);
    if (financialsData) setFinancials(financialsData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSaveFinancials(data: Partial<UserFinancials>) {
    if (financials) {
      await supabase.from("user_financials").update(data).eq("id", financials.id);
    } else {
      await supabase.from("user_financials").insert(data);
    }
    fetchData();
  }

  async function handleAddTarget(data: Partial<TargetWatch>) {
    await supabase.from("target_watches").insert(data);
    fetchData();
  }

  async function handleRemoveTarget(id: string) {
    await supabase.from("target_watches").delete().eq("id", id);
    fetchData();
  }

  async function handleReorder(reordered: TargetWatch[]) {
    setTargets(reordered);
    for (const t of reordered) {
      await supabase
        .from("target_watches")
        .update({ priority_order: t.priority_order })
        .eq("id", t.id);
    }
  }

  const timeline: TimelineEntry[] =
    financials && targets.length > 0
      ? calculateTimeline(targets, financials)
      : [];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-500">Loading targets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Purchase Targets</h1>
      <FinancialsForm
        financials={financials}
        onSave={handleSaveFinancials}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <TargetList
          targets={targets}
          onAdd={handleAddTarget}
          onRemove={handleRemoveTarget}
          onReorder={handleReorder}
        />
        <TimelineView entries={timeline} />
      </div>
    </div>
  );
}
