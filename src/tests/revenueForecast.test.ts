import { forecastMonthlyRevenue } from '../utils/business/revenueForecast';
export function runRevenueForecastTests() {
  const proj = forecastMonthlyRevenue([1000, 2000, 3000]);
  if (proj !== 60000) throw new Error('Projected revenue calculation mismatch');
  return true;
}
