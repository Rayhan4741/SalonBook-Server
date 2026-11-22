export function parseStripeBalanceResponse(raw: any) {
  return { available: raw?.available || [], pending: raw?.pending || [] };
}
