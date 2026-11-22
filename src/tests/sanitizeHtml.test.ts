import { stripHtmlTags } from '../utils/security/sanitizeHtml';
export function runSanitizeHtmlTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  assert(stripHtmlTags('<script>alert(1)</script>hello') === 'hello', 'XSS tag strip failed');
  return true;
}
