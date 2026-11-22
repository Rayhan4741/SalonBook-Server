import { getVipTier } from '../services/vipTierCalculator';
export function runVipTierTests() {
  if (getVipTier(2500) !== 'Platinum') throw new Error('Platinum tier evaluation failed');
  if (getVipTier(100) !== 'Bronze') throw new Error('Bronze tier evaluation failed');
  return true;
}
