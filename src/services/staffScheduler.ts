export interface StaffMember { id: string; name: string; specialties: string[]; active: boolean; }
export function findAvailableStylist(stylists: StaffMember[], serviceCategory: string): StaffMember | null {
  return stylists.find(s => s.active && s.specialties.includes(serviceCategory)) || null;
}
