import type { Watch, CollectionSummary } from "@/types";
import { calculateCollectionIRR } from "./irr";

export function calculateCollectionSummary(
  watches: Watch[]
): CollectionSummary {
  const totalCostBasis = watches.reduce((s, w) => s + w.purchase_price, 0);
  const totalCurrentValue = watches.reduce((s, w) => s + w.current_value, 0);
  const totalPnL = totalCurrentValue - totalCostBasis;
  const collectionIRR =
    watches.length > 0 ? calculateCollectionIRR(watches) : 0;

  return { totalCostBasis, totalCurrentValue, totalPnL, collectionIRR };
}

export function whatIfAddWatch(
  watches: Watch[],
  hypothetical: Watch
): CollectionSummary {
  return calculateCollectionSummary([...watches, hypothetical]);
}

export function whatIfRemoveWatch(
  watches: Watch[],
  watchId: string
): CollectionSummary {
  return calculateCollectionSummary(watches.filter((w) => w.id !== watchId));
}
