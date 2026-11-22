import crypto from 'crypto';
export function generateNonce(bytes = 16): string { return crypto.randomBytes(bytes).toString('base64'); }
