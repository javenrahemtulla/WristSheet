interface DepreciationPoint {
  year: number;
  value: number;
  percentOfPurchase: number;
}

export function calculateDepreciationCurve(
  purchasePrice: number,
  currentValue: number,
  purchaseDate: string,
  yearsToProject: number = 10
): DepreciationPoint[] {
  const now = new Date();
  const purchased = new Date(purchaseDate);
  const yearsOwned =
    (now.getTime() - purchased.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  if (yearsOwned <= 0) {
    return [{ year: 0, value: purchasePrice, percentOfPurchase: 1 }];
  }

  const annualRate = Math.pow(currentValue / purchasePrice, 1 / yearsOwned) - 1;

  const points: DepreciationPoint[] = [];
  for (let y = 0; y <= yearsToProject; y++) {
    const value = purchasePrice * Math.pow(1 + annualRate, y);
    points.push({
      year: y,
      value: Math.round(value),
      percentOfPurchase: value / purchasePrice,
    });
  }
  return points;
}
