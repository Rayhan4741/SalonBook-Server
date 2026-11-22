import { calculatePeakMultiplier } from '../services/peakHourPricing';
export function runPeakPricingTests() {
  if (calculatePeakMultiplier('5:00 PM') !== 1.15) throw new Error('Peak pricing rate failed');
  if (calculatePeakMultiplier('10:00 AM') !== 1.0) throw new Error('Normal pricing rate failed');
  return true;
}
