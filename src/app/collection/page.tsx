"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SummaryCards } from "@/components/collection/summary-cards";
import { WatchTable } from "@/components/collection/watch-table";
import { WatchForm } from "@/components/collection/watch-form";
import { WatchDetail } from "@/components/collection/watch-detail";
import { WhatIfPanel } from "@/components/collection/whatif-panel";
import { calculateCollectionSummary } from "@/lib/financial/whatif";
import type { Watch } from "@/types";
import { Plus, FlaskConical } from "lucide-react";

export default function CollectionPage() {
  const supabase = createClient();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState<Watch | undefined>();
  const [viewingWatch, setViewingWatch] = useState<Watch | undefined>();
  const [whatIfMode, setWhatIfMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchWatches = useCallback(async () => {
    const { data } = await supabase
      .from("watches")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setWatches(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  async function handleSubmit(data: Omit<Watch, "id" | "user_id" | "created_at">) {
    setSaving(true);
    if (editingWatch) {
      await supabase.from("watches").update(data).eq("id", editingWatch.id);
    } else {
      await supabase.from("watches").insert(data);
    }
    setSaving(false);
    setFormOpen(false);
    setEditingWatch(undefined);
    fetchWatches();
  }

  async function handleDelete(id: string) {
    await supabase.from("watches").delete().eq("id", id);
    fetchWatches();
  }

  function handleEdit(watch: Watch) {
    setEditingWatch(watch);
    setFormOpen(true);
  }

  const summary = calculateCollectionSummary(watches);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-500">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Collection</h1>
        <div className="flex gap-2">
          <Button
            variant={whatIfMode ? "secondary" : "outline"}
            onClick={() => setWhatIfMode(!whatIfMode)}
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            What If
          </Button>
          <Button onClick={() => { setEditingWatch(undefined); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Watch
          </Button>
        </div>
      </div>

      {whatIfMode ? (
        <WhatIfPanel watches={watches} />
      ) : (
        <>
          <SummaryCards summary={summary} />
          <WatchTable
            watches={watches}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={setViewingWatch}
          />
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent onClose={() => setFormOpen(false)}>
          <DialogHeader>
            <DialogTitle>{editingWatch ? "Edit Watch" : "Add Watch"}</DialogTitle>
          </DialogHeader>
          <WatchForm
            watch={editingWatch}
            onSubmit={handleSubmit}
            onCancel={() => { setFormOpen(false); setEditingWatch(undefined); }}
            loading={saving}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingWatch} onOpenChange={() => setViewingWatch(undefined)}>
        <DialogContent className="max-w-2xl" onClose={() => setViewingWatch(undefined)}>
          {viewingWatch && <WatchDetail watch={viewingWatch} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
