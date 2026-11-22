export async function measureAsyncExecutionTime<T>(label: string, fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const start = process.hrtime();
  const result = await fn();
  const [sec, nano] = process.hrtime(start);
  const durationMs = sec * 1000 + nano / 1000000;
  return { result, durationMs };
}
