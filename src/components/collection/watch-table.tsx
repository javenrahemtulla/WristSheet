"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Watch } from "@/types";
import { Pencil, Trash2, Eye } from "lucide-react";

interface WatchTableProps {
  watches: Watch[];
  onEdit: (watch: Watch) => void;
  onDelete: (id: string) => void;
  onView: (watch: Watch) => void;
}

export function WatchTable({ watches, onEdit, onDelete, onView }: WatchTableProps) {
  if (watches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center">
        <p className="text-zinc-500">No watches in your collection yet.</p>
        <p className="text-sm text-zinc-400">Add your first watch to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Watch</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Reference</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Cost</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Value</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">P&L</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Purchased</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {watches.map((watch) => {
            const pnl = watch.current_value - watch.purchase_price;
            const isPositive = pnl >= 0;
            return (
              <tr key={watch.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{watch.brand}</div>
                  <div className="text-zinc-500">{watch.model}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{watch.reference_number}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(watch.purchase_price)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(watch.current_value)}</td>
                <td className={`px-4 py-3 text-right font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}{formatCurrency(pnl)}
                </td>
                <td className="px-4 py-3 text-zinc-500">{formatDate(watch.purchase_date)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onView(watch)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(watch)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(watch.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
