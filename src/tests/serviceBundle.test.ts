import { calculateBundleDiscount } from '../services/serviceBundleCalculator';
export function runBundleTests() {
  const res = calculateBundleDiscount([10000, 10000, 10000]); // 3 items = 20%
  if (res.savings !== 6000) throw new Error('Bundle discount calculation failed');
  return true;
}
