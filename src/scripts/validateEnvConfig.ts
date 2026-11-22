import { config } from '../config/env';
export function auditEnvironmentVariables(): { valid: boolean; missing: string[] } {
  const required = ['MONGODB_URI', 'BETTER_AUTH_SECRET', 'STRIPE_SECRET_KEY'];
  const missing = required.filter(k => !(config as any)[k.toLowerCase()]);
  return { valid: missing.length === 0, missing };
}
