import mongoose from 'mongoose';
export function isReplicaSetPrimary(): boolean {
  return mongoose.connection.readyState === 1;
}
