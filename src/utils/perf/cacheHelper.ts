export class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();
  set(key: string, value: T, ttlMs: number = 60000): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) { this.cache.delete(key); return null; }
    return item.value;
  }
  clear(): void { this.cache.clear(); }
}
