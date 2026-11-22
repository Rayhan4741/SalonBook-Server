import { dollarsToCents, centsToDollars } from "../utils/priceHelper";

export function runPriceHelperTests(): boolean {
  console.log("Running priceHelper unit tests...");
  const t1 = dollarsToCents(65) === 6500;
  const t2 = dollarsToCents(12.5) === 1250;
  const t3 = centsToDollars(6500) === 65;

  const passed = t1 && t2 && t3;
  console.log(`priceHelper tests: ${passed ? "PASSED" : "FAILED"}`);
  return passed;
}
