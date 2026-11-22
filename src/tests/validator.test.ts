import { validateRequiredFields } from "../utils/validator";

export function runValidatorTests(): boolean {
  console.log("Running validator unit tests...");
  const valid = validateRequiredFields({ a: "hello", b: 123 }, ["a", "b"]) === null;
  const missing = validateRequiredFields({ a: "hello" }, ["a", "b"]) !== null;

  const passed = valid && missing;
  console.log(`validator tests: ${passed ? "PASSED" : "FAILED"}`);
  return passed;
}
