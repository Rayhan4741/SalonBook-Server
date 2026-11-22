export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>?/gm, '').trim();
}
