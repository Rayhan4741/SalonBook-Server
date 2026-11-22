export function getBufferTimeBetweenServices(durationMinutes: number): number {
  return durationMinutes >= 90 ? 20 : 15; // 15-20 min sanitation buffer
}
