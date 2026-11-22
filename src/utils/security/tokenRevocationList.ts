const revokedTokens = new Set<string>();
export function revokeToken(tokenId: string): void { revokedTokens.add(tokenId); }
export function isTokenRevoked(tokenId: string): boolean { return revokedTokens.has(tokenId); }
