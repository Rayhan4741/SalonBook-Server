import { validatePromoCode } from '../utils/business/promoCodeValidator';
export function runPromoCodeTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  assert(validatePromoCode('VIPGUEST')?.discountPercent === 15, 'VIP promo code failed');
  assert(validatePromoCode('INVALID') === null, 'Invalid promo code succeeded');
  return true;
}
