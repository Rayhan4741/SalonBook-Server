export function isWithinSalonHours(timeSlot: string): boolean {
  const match = timeSlot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return false;
  let hour = parseInt(match[1], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour >= 9 && hour <= 20; // 9 AM to 8 PM
}
