import crypto from 'crypto';
export function generateCsrfToken(): string { return crypto.randomBytes(32).toString('hex'); }
export function verifyCsrfToken(a: string, b: string): boolean { return a === b && !!a; }
