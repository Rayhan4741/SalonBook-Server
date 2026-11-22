export interface SalonSuite { id: string; name: string; type: 'hair' | 'spa' | 'nails'; occupied: boolean; }
export function findAvailableSuite(suites: SalonSuite[], type: string): SalonSuite | null {
  return suites.find(s => s.type === type && !s.occupied) || null;
}
