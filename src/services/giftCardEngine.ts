export interface GiftCard { code: string; balanceCents: number; active: boolean; }
export function redeemGiftCard(card: GiftCard, amountCents: number): { deducted: number; remaining: number } {
  const deducted = Math.min(card.balanceCents, amountCents);
  return { deducted, remaining: card.balanceCents - deducted };
}
