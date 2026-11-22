export function buildDateRangeFilter(startIso?: string, endIso?: string) {
  const query: Record<string, any> = {};
  if (startIso || endIso) {
    query.createdAt = {};
    if (startIso) query.createdAt.$gte = new Date(startIso);
    if (endIso) query.createdAt.$lte = new Date(endIso);
  }
  return query;
}
