"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TimelineEntry } from "@/types";
import { Calendar, CheckCircle } from "lucide-react";

export function TimelineView({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-zinc-500">Add target watches and financial info to see your purchase timeline.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Purchase Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {entries.map((entry, i) => {
            const isPast = entry.projectedDate <= new Date();
            return (
              <div key={entry.target.id} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isPast
                        ? "bg-green-100 text-green-600"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                  </div>
                  {i < entries.length - 1 && (
                    <div className="mt-1 h-full w-px bg-zinc-200" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-medium">
                      {entry.target.brand} {entry.target.model}
                    </h4>
                    <span className="text-sm font-semibold">
                      {formatCurrency(entry.target.target_price)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {isPast ? "Affordable now" : formatDate(entry.projectedDate)}
                    {!isPast && ` (${entry.weeksToSave} weeks of saving)`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
