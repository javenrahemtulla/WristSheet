import type { LiquidationScenario } from "@/types";

const CHANNELS = [
  { channel: "chrono24" as const, label: "Chrono24", feePercent: 0.07 },
  { channel: "dealer_buyback" as const, label: "Dealer Buyback", feePercent: 0.175 },
  { channel: "private_sale" as const, label: "Private Sale", feePercent: 0.03 },
] as const;

export function calculateLiquidation(
  currentValue: number
): LiquidationScenario[] {
  return CHANNELS.map(({ channel, label, feePercent }) => ({
    channel,
    label,
    feePercent,
    netProceeds: Math.round(currentValue * (1 - feePercent)),
  }));
}
