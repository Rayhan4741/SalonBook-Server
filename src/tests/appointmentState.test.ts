export function isValidTransition(from: string, to: string, actor: "customer" | "admin"): boolean {
  if (actor === "customer") {
    // Customers can cancel only their own pending appointments
    return from === "pending" && to === "cancelled";
  }
  if (actor === "admin") {
    // Admin can confirm pending, or cancel pending/confirmed
    if (to === "confirmed") return from === "pending";
    if (to === "cancelled") return from === "pending" || from === "confirmed";
  }
  return false;
}

export function runAppointmentStateTests(): boolean {
  console.log("Running appointment state machine unit tests...");
  const t1 = isValidTransition("pending", "cancelled", "customer");
  const t2 = !isValidTransition("confirmed", "cancelled", "customer");
  const t3 = isValidTransition("pending", "confirmed", "admin");
  const t4 = isValidTransition("confirmed", "cancelled", "admin");

  const passed = t1 && t2 && t3 && t4;
  console.log(`appointmentState tests: ${passed ? "PASSED" : "FAILED"}`);
  return passed;
}
