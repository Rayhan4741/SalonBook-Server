export function exportAuditLogsAsJson(logs: any[]): string {
  return JSON.stringify(logs, null, 2);
}
