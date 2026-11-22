export async function processBatch<T>(items: T[], batchSize: number, handler: (b: T[]) => Promise<void>) {
  for (let i = 0; i < items.length; i += batchSize) {
    await handler(items.slice(i, i + batchSize));
  }
}
