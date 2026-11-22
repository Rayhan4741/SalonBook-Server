export function makeDummyBookingPayload(customerId: string, serviceId: string) {
  return {
    customerId,
    serviceId,
    appointmentDate: '2026-12-15',
    timeSlot: '02:00 PM',
    message: 'Test automated booking reservation'
  };
}
