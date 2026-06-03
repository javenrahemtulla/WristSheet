interface CashFlow {
  date: Date;
  amount: number;
}

export function calculateIRR(cashFlows: CashFlow[]): number {
  if (cashFlows.length < 2) return 0;

  const sorted = [...cashFlows].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  function npv(rate: number): number {
    const firstDate = sorted[0].date.getTime();
    return sorted.reduce((sum, cf) => {
      const years =
        (cf.date.getTime() - firstDate) / (365.25 * 24 * 60 * 60 * 1000);
      return sum + cf.amount / Math.pow(1 + rate, years);
    }, 0);
  }

  function npvDerivative(rate: number): number {
    const firstDate = sorted[0].date.getTime();
    return sorted.reduce((sum, cf) => {
      const years =
        (cf.date.getTime() - firstDate) / (365.25 * 24 * 60 * 60 * 1000);
      return sum + (-years * cf.amount) / Math.pow(1 + rate, years + 1);
    }, 0);
  }

  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    const f = npv(rate);
    const fPrime = npvDerivative(rate);
    if (Math.abs(fPrime) < 1e-10) break;
    const newRate = rate - f / fPrime;
    if (Math.abs(newRate - rate) < 1e-7) return newRate;
    rate = newRate;
  }
  return rate;
}

export function calculateCollectionIRR(
  watches: Array<{
    purchase_price: number;
    purchase_date: string;
    current_value: number;
  }>
): number {
  const cashFlows: CashFlow[] = [];
  const now = new Date();

  for (const w of watches) {
    cashFlows.push({ date: new Date(w.purchase_date), amount: -w.purchase_price });
  }

  const totalCurrentValue = watches.reduce((s, w) => s + w.current_value, 0);
  cashFlows.push({ date: now, amount: totalCurrentValue });

  return calculateIRR(cashFlows);
}
