import crypto from 'crypto';
export function generateClientFingerprint(userAgent: string, ip: string): string {
  return crypto.createHash('sha256').update(`${userAgent}_${ip}`).digest('hex');
}
