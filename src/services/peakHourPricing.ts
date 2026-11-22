export function calculatePeakMultiplier(timeSlot: string): number {
  if (timeSlot.includes('5:00 PM') || timeSlot.includes('6:00 PM')) return 1.15; // 15% peak
  return 1.0;
}
