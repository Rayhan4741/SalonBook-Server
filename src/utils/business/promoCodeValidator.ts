export interface PromoRule { code: string; discountPercent: number; active: boolean; }
export const validPromoCodes: PromoRule[] = [
  { code: 'VIPGUEST', discountPercent: 15, active: true },
  { code: 'WELCOME10', discountPercent: 10, active: true },
];
export function validatePromoCode(code: string): PromoRule | null {
  const match = validPromoCodes.find(p => p.code === code.toUpperCase() && p.active);
  return match || null;
}
