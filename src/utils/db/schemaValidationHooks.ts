export function sanitizeStringField(val: string): string {
  return (val || '').trim();
}
