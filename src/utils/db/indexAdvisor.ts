export const recommendedIndexes = [
  { collection: 'appointments', index: { customerId: 1, appointmentDate: 1 } },
  { collection: 'appointments', index: { serviceId: 1, appointmentDate: 1, timeSlot: 1 } },
  { collection: 'transactions', index: { stripeSessionId: 1 }, unique: true },
  { collection: 'users', index: { email: 1 }, unique: true },
];
