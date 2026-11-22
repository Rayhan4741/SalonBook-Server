export function calculateNextReminderRun(intervalMinutes = 60): Date {
  return new Date(Date.now() + intervalMinutes * 60 * 1000);
}
