export function getVipTier(spendDollars: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (spendDollars >= 2000) return 'Platinum';
  if (spendDollars >= 1000) return 'Gold';
  if (spendDollars >= 500) return 'Silver';
  return 'Bronze';
}
