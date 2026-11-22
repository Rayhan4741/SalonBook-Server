import { MemoryCache } from '../utils/perf/cacheHelper';
export function runCacheTests() {
  const cache = new MemoryCache<string>();
  cache.set('key', 'val', 5000);
  if (cache.get('key') !== 'val') throw new Error('Cache retrieval failed');
  return true;
}
