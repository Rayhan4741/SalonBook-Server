import { calculateLoyaltyPoints } from '../utils/business/loyaltyPoints';
export function runLoyaltyTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  assert(calculateLoyaltyPoints(5000) === 5, '5000 cents should give 5 points');
  return true;
}
