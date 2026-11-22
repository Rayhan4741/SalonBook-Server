import { checkoutRateLimiter, bookingRateLimiter } from "../middleware/rateLimiters";

export function runRateLimiterTests(): boolean {
  console.log("Running rateLimiter unit test...");
  return !!checkoutRateLimiter && !!bookingRateLimiter;
}
