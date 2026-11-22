export interface SalonProduct { id: string; name: string; quantity: number; threshold: number; }
export function checkLowInventory(products: SalonProduct[]): SalonProduct[] {
  return products.filter(p => p.quantity <= p.threshold);
}
