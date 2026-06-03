import type { TargetWatch, UserFinancials, TimelineEntry } from "@/types";

export function calculateTimeline(
  targets: TargetWatch[],
  financials: UserFinancials
): TimelineEntry[] {
  const weeklySavings =
    (financials.monthly_income * financials.weekly_savings_rate) / 4.33;
  const sorted = [...targets].sort(
    (a, b) => a.priority_order - b.priority_order
  );

  let runningBalance = financials.current_savings;
  let totalWeeksElapsed = 0;
  const now = new Date();
  const entries: TimelineEntry[] = [];

  for (const target of sorted) {
    const deficit = target.target_price - runningBalance;
    const weeksNeeded = deficit > 0 ? Math.ceil(deficit / weeklySavings) : 0;
    totalWeeksElapsed += weeksNeeded;

    const projectedDate = new Date(now);
    projectedDate.setDate(projectedDate.getDate() + totalWeeksElapsed * 7);

    runningBalance =
      runningBalance + weeksNeeded * weeklySavings - target.target_price;

    entries.push({
      target,
      projectedDate,
      weeksToSave: weeksNeeded,
      cumulativeSavings: runningBalance,
    });
  }

  return entries;
}
