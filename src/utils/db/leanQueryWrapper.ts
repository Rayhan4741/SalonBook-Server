export function applyLeanOption<T>(query: any): Promise<T> {
  return query.lean().exec();
}
