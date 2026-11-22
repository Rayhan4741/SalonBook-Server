export function computeRemainingSlots(allSlots: string[], bookedSlots: string[]): string[] {
  const bookedSet = new Set(bookedSlots);
  return allSlots.filter(s => !bookedSet.has(s));
}
