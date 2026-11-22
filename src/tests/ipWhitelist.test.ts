import { isIpWhitelisted } from '../utils/security/ipWhitelist';
export function runIpWhitelistTests() {
  if (!isIpWhitelisted('127.0.0.1')) throw new Error('Localhost ip whitelisting failed');
  return true;
}
