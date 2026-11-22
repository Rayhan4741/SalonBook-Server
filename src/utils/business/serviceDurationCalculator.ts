export function calculateTotalTreatmentTime(durationsMinutes: number[]): number {
  return durationsMinutes.reduce((acc, d) => acc + d, 0);
}
