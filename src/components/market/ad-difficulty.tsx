"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AdDifficultySignal } from "@/types";

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  hard: "bg-orange-100 text-orange-800",
  allocation_only: "bg-red-100 text-red-800",
};

const DIFFICULTY_LABELS = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  allocation_only: "Allocation Only",
};

export function AdDifficulty({ signals }: { signals: AdDifficultySignal[] }) {
  if (signals.length === 0) return null;

  const counts = signals.reduce(
    (acc, s) => {
      acc[s.sentiment] = (acc[s.sentiment] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof DIFFICULTY_LABELS;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AD Difficulty</CardTitle>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${DIFFICULTY_COLORS[dominant]}`}
          >
            {DIFFICULTY_LABELS[dominant]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {signals.slice(0, 5).map((signal) => (
          <div key={signal.id} className="rounded-md border border-zinc-100 p-3">
            <p className="text-sm italic text-zinc-700">
              &ldquo;{signal.quote_text}&rdquo;
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              — u/{signal.author} &middot;{" "}
              {new Date(signal.posted_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {signals.length > 5 && (
          <p className="text-xs text-zinc-400">
            + {signals.length - 5} more reports
          </p>
        )}
      </CardContent>
    </Card>
  );
}
