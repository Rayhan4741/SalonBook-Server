export function parsePaginationParams(query: Record<string, any>, defaultLimit: number = 50) {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit as string, 10) || defaultLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
