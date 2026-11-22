import mongoose from 'mongoose';
export async function measurePingLatency(): Promise<number> {
  const start = Date.now();
  await mongoose.connection.db?.admin().ping();
  return Date.now() - start;
}
