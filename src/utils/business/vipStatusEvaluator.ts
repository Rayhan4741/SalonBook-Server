export function isVipCustomer(completedBookings: number, totalSpendCents: number): boolean {
  return completedBookings >= 5 || totalSpendCents >= 50000;
}
