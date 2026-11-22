export function buildRateLimitKey(prefix: string, identifier: string): string {
  return `rl:${prefix}:${identifier.trim().toLowerCase()}`;
}
