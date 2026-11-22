import { isVipCustomer } from '../utils/business/vipStatusEvaluator';
export function runVipEvaluatorTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  assert(isVipCustomer(6, 10000) === true, '6 bookings should qualify VIP');
  assert(isVipCustomer(1, 1000) === false, '1 booking should not qualify VIP');
  return true;
}
