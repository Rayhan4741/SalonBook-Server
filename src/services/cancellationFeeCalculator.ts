export function calculateLateCancelFee(priceCents: number, hoursBefore: number): number {
  if (hoursBefore < 12) return Math.round(priceCents * 0.50); // 50% late fee
  return 0;
}
