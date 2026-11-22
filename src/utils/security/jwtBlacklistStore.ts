const blacklistedJtis = new Set<string>();
export function blacklistJti(jti: string): void { blacklistedJtis.add(jti); }
export function isJtiBlacklisted(jti: string): boolean { return blacklistedJtis.has(jti); }
