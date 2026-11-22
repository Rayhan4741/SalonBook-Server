import { isEligibleForFullRefund } from '../utils/business/cancellationPolicy';
export function runCancellationPolicyTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  const future = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  assert(isEligibleForFullRefund(future) === true, '48h advance should be eligible');
  return true;
}
