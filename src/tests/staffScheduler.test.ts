import { findAvailableStylist } from '../services/staffScheduler';
export function runStaffSchedulerTests() {
  const staff = [{ id: '1', name: 'Elena', specialties: ['Hair'], active: true }];
  if (!findAvailableStylist(staff, 'Hair')) throw new Error('Stylist matching failed');
  return true;
}
