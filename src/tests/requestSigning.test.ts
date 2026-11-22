import { signPayload, verifySignature } from '../utils/security/requestSigning';
export function runSigningTests() {
  const sig = signPayload('test_body', 'secret_key');
  if (!verifySignature('test_body', sig, 'secret_key')) throw new Error('Signature verify failed');
  return true;
}
