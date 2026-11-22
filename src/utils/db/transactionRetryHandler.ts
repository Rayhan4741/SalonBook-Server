export async function executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try { return await fn(); } catch (err: any) {
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 100 * attempt));
    }
  }
  throw new Error('Transaction execution failed');
}
