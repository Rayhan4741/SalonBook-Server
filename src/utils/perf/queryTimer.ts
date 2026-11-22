export function measureExecutionTime<T>(label: string, fn: () => T): { result: T; durationMs: number } {
  const start = process.hrtime();
  const result = fn();
  const [sec, nano] = process.hrtime(start);
  const durationMs = sec * 1000 + nano / 1000000;
  return { result, durationMs };
}
