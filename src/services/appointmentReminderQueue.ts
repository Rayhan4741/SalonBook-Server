export function filterAppointmentsNeedingReminder(appointments: any[], hoursAhead = 24): any[] {
  const targetTime = Date.now() + hoursAhead * 3600 * 1000;
  return appointments.filter(a => {
    const t = new Date(a.appointmentDate).getTime();
    return Math.abs(t - targetTime) < 3600 * 1000 && a.status === 'confirmed';
  });
}
