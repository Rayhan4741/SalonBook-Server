export interface AppointmentAuditEntry {
  appointmentId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  timestamp: string;
}
export function createAuditLogEntry(apptId: string, prev: string, next: string, actor: string): AppointmentAuditEntry {
  return { appointmentId: apptId, previousStatus: prev, newStatus: next, changedBy: actor, timestamp: new Date().toISOString() };
}
