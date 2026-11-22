import mongoose from 'mongoose';
export async function getSystemHealthStatus() {
  const dbConnected = mongoose.connection.readyState === 1;
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  return {
    status: dbConnected ? 'healthy' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    uptimeSeconds: Math.floor(uptime),
    memoryRssMb: Math.round(memory.rss / (1024 * 1024)),
    timestamp: new Date().toISOString()
  };
}
