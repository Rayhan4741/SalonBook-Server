import { buildDateRangeFilter } from '../utils/db/dateRangeQueryBuilder';
export function runDateRangeTests() {
  const f = buildDateRangeFilter('2026-01-01', '2026-01-31');
  if (!f.createdAt?.$gte) throw new Error('Start date query missing');
  return true;
}
