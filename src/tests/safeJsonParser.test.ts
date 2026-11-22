import { safeJsonParse } from '../utils/security/safeJsonParser';
export function runJsonParseTests() {
  if (safeJsonParse('{"a":1}', {}).a !== 1) throw new Error('Valid json failed');
  if (safeJsonParse('bad json', { fallback: true }).fallback !== true) throw new Error('Fallback failed');
  return true;
}
