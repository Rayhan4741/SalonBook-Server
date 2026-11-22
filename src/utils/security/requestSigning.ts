import crypto from 'crypto';
export function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
export function verifySignature(payload: string, sig: string, secret: string): boolean {
  return signPayload(payload, secret) === sig;
}
