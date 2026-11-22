import { isWithinSalonHours } from '../utils/business/operatingHours';
export function runOperatingHoursTests() {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  assert(isWithinSalonHours('10:00 AM') === true, '10 AM should be open');
  assert(isWithinSalonHours('04:00 AM') === false, '4 AM should be closed');
  return true;
}
