export function validatePasswordPolicy(p: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (p.length < 8) errors.push('Minimum 8 characters');
  if (!/[A-Z]/.test(p)) errors.push('At least one uppercase character');
  if (!/[a-z]/.test(p)) errors.push('At least one lowercase character');
  if (!/[0-9]/.test(p)) errors.push('At least one number');
  return { valid: errors.length === 0, errors };
}
