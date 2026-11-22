export function logSlowQuery(op: string, durationMs: number, threshold = 200) {
  if (durationMs > threshold) console.warn(`⚠️ Slow query alert [${op}]: ${durationMs.toFixed(2)}ms`);
}
