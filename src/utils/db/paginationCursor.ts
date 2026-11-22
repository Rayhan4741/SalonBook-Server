export function buildCursorPaginationQuery(lastId?: string) {
  return lastId ? { _id: { $gt: lastId } } : {};
}
