export const rolePermissions: Record<string, string[]> = {
  admin: ['services:read', 'services:write', 'appointments:read', 'appointments:manage', 'users:manage', 'revenue:read'],
  customer: ['services:read', 'appointments:book', 'appointments:my', 'profile:update'],
};
export function hasPermission(role: string, perm: string): boolean {
  return (rolePermissions[role] || []).includes(perm);
}
