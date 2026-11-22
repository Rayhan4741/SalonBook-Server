export function dollarsToCents(amountInDollars: number): number {
  return Math.round(Number(amountInDollars) * 100);
}

export function centsToDollars(amountInCents: number): number {
  return Math.round(Number(amountInCents)) / 100;
}
