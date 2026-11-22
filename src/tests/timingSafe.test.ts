import { timingSafeEqualString } from '../utils/security/timingSafe';
export function runTimingSafeTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  assert(timingSafeEqualString('whsec_test', 'whsec_test') === true, 'Matching strings failed');
  assert(timingSafeEqualString('whsec_test', 'whsec_fake') === false, 'Mismatched strings matched');
  return true;
}
