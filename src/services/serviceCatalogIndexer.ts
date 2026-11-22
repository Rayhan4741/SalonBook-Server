export function buildCategoryIndex(services: any[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of services) {
    counts[s.category] = (counts[s.category] || 0) + 1;
  }
  return counts;
}
