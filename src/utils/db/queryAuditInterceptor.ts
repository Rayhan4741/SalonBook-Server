export function auditDbQuery(model: string, action: string, durationMs: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DB AUDIT] ${model}.${action} (${durationMs.toFixed(1)}ms)`);
  }
}
