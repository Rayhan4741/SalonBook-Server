export function forecastMonthlyRevenue(recentDailyRevenues: number[]): number {
  if (!recentDailyRevenues.length) return 0;
  const avgDaily = recentDailyRevenues.reduce((a, b) => a + b, 0) / recentDailyRevenues.length;
  return Math.round(avgDaily * 30);
}
