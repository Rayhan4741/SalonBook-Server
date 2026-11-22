export function pruneOldAuditLogs(logs: any[], retentionDays = 90): any[] {
  const cutoff = Date.now() - retentionDays * 24 * 3600 * 1000;
  return logs.filter(l => new Date(l.timestamp).getTime() > cutoff);
}
