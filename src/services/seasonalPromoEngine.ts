export function getSeasonalPromoTag(date: Date = new Date()): string {
  const month = date.getMonth();
  if (month === 11 || month === 0) return 'Winter Radiance';
  if (month >= 2 && month <= 4) return 'Spring Renewal';
  if (month >= 5 && month <= 7) return 'Summer Glow';
  return 'Autumn Indulgence';
}
