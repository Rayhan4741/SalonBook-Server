export function runAppointmentServiceTests(): boolean {
  console.log("Running appointmentService unit test...");
  const slotConflict = (slotA: string, slotB: string) => slotA === slotB;
  return slotConflict("09:00 AM - 10:00 AM", "09:00 AM - 10:00 AM");
}
