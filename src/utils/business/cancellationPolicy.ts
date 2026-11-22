export function isEligibleForFullRefund(appointmentDate: string): boolean {
  const apptTime = new Date(appointmentDate).getTime();
  const diffHours = (apptTime - Date.now()) / (1000 * 60 * 60);
  return diffHours >= 24; // 24-hour advance cancellation rule
}
