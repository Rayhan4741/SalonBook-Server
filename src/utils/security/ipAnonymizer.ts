export function anonymizeIpAddress(ip: string): string {
  if (!ip) return '0.0.0.0';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  return ip.split(':').slice(0, 3).join(':') + '::';
}
