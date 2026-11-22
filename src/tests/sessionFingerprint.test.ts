import { generateClientFingerprint } from '../utils/security/sessionFingerprint';
export function runFingerprintTests() {
  const f1 = generateClientFingerprint('Chrome', '127.0.0.1');
  const f2 = generateClientFingerprint('Chrome', '127.0.0.1');
  if (f1 !== f2) throw new Error('Deterministic fingerprint generation mismatch');
  return true;
}
