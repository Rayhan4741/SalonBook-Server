import { generateCsrfToken, verifyCsrfToken } from '../utils/security/csrfTokenHelper';
export function runCsrfTests() {
  const t = generateCsrfToken();
  if (!verifyCsrfToken(t, t)) throw new Error('CSRF match failed');
  if (verifyCsrfToken(t, 'fake')) throw new Error('CSRF mismatch allowed');
  return true;
}
