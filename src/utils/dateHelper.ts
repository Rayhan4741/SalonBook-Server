export function isValidDateString(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== "string") return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(`${dateStr}T00:00:00`);
  return !isNaN(d.getTime());
}

export function isUpcomingDate(dateStr: string): boolean {
  if (!isValidDateString(dateStr)) return false;
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate >= today;
}
