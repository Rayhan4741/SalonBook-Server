export function isOriginPermitted(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
}
