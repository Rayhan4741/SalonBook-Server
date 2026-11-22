const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();
export function recordFailedLogin(email: string): boolean {
  const now = Date.now();
  const entry = failedAttempts.get(email) || { count: 0, lockedUntil: 0 };
  entry.count++;
  if (entry.count >= 5) entry.lockedUntil = now + 15 * 60 * 1000;
  failedAttempts.set(email, entry);
  return entry.count >= 5;
}
export function isAccountLocked(email: string): boolean {
  const entry = failedAttempts.get(email);
  if (!entry) return false;
  if (Date.now() > entry.lockedUntil) { failedAttempts.delete(email); return false; }
  return entry.count >= 5;
}
