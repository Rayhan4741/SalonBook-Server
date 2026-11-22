export function calculateBundleDiscount(pricesCents: number[]): { total: number; discounted: number; savings: number } {
  const total = pricesCents.reduce((a, b) => a + b, 0);
  const discountRate = pricesCents.length >= 3 ? 0.20 : pricesCents.length === 2 ? 0.10 : 0;
  const savings = Math.round(total * discountRate);
  return { total, discounted: total - savings, savings };
}
