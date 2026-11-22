const whitelistedIps = new Set<string>(['127.0.0.1', '::1']);
export function isIpWhitelisted(ip: string): boolean { return whitelistedIps.has(ip); }
export function addWhitelistedIp(ip: string): void { whitelistedIps.add(ip); }
