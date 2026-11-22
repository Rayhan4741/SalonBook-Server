export function calculateRepeatGuestRate(totalGuests: number, repeatGuests: number): number {
  if (totalGuests <= 0) return 0;
  return Math.round((repeatGuests / totalGuests) * 100);
}
