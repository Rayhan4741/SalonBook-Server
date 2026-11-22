export function isValidJwtPayload(payload: any): boolean {
  return !!(payload && payload.userId && typeof payload.userId === 'string');
}
