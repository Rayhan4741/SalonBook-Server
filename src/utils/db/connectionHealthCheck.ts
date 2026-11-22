import mongoose from 'mongoose';
export async function pingDatabase(): Promise<boolean> {
  try { return (await mongoose.connection.db?.admin().ping())?.ok === 1; } catch { return false; }
}
