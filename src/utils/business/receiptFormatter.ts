export function generateReceiptNumber(appointmentId: string, timestamp: Date = new Date()): string {
  const year = timestamp.getFullYear();
  const shortId = appointmentId.slice(-6).toUpperCase();
  return `SB-${year}-${shortId}`;
}
