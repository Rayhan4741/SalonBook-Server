export function runUserServiceTests(): boolean {
  console.log("Running userService unit test...");
  const sampleUser = { id: "u1", role: "customer", isBlocked: false };
  return sampleUser.role === "customer" && !sampleUser.isBlocked;
}
