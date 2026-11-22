import mongoose from 'mongoose';
export function getDbConnectionMetrics() {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  };
}
