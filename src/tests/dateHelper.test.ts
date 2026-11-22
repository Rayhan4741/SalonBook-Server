import { isValidDateString, isUpcomingDate } from "../utils/dateHelper";

export function runDateHelperTests(): boolean {
  console.log("Running dateHelper unit tests...");
  const validFormat = isValidDateString("2026-12-25");
  const invalidFormat = !isValidDateString("25-12-2026");
  const pastCheck = !isUpcomingDate("2020-01-01");

  const passed = validFormat && invalidFormat && pastCheck;
  console.log(`dateHelper tests: ${passed ? "PASSED" : "FAILED"}`);
  return passed;
}
