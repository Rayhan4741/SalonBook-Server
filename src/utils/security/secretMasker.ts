export function maskSensitiveString(str: string): string {
  if (!str || str.length <= 6) return '******';
  return str.slice(0, 3) + '...' + str.slice(-3);
}
