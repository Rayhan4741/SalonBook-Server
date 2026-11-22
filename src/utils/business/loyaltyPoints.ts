export function calculateLoyaltyPoints(totalSpentCents: number): number {
  return Math.floor(totalSpentCents / 1000); // 1 point per $10 spent
}
