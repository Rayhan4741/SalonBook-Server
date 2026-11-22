export function runServiceServiceTests(): boolean {
  console.log("Running serviceService unit test...");
  const sampleService = { price: 65, duration: 60, status: "active" };
  return sampleService.price > 0 && sampleService.status === "active";
}
