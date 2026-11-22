import { redeemGiftCard } from '../services/giftCardEngine';
export function runGiftCardTests() {
  const res = redeemGiftCard({ code: 'GIFT50', balanceCents: 5000, active: true }, 3000);
  if (res.deducted !== 3000 || res.remaining !== 2000) throw new Error('Gift card deduction failed');
  return true;
}
