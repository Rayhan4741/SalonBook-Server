import { runAppointmentStateTests } from "./appointmentState.test";
import { runDateHelperTests } from "./dateHelper.test";
import { runPriceHelperTests } from "./priceHelper.test";
import { runValidatorTests } from "./validator.test";
import { runTokenHelperTests } from "./tokenHelper.test";
import { runIdempotencyTests } from "./idempotency.test";
import { runQueryParserTests } from "./queryParser.test";
import { runErrorHandlerTests } from "./errorHandler.test";
import { runRateLimiterTests } from "./rateLimiter.test";
import { runLoggerTests } from "./logger.test";
import { runAppointmentServiceTests } from "./appointmentService.test";
import { runServiceServiceTests } from "./serviceService.test";
import { runUserServiceTests } from "./userService.test";

export function runAllUnitTests() {
  console.log("==========================================");
  console.log("🧪 RUNNING SERVER UNIT TEST SUITE 🧪");
  console.log("==========================================\n");

  const tests = [
    { name: "appointmentState", fn: runAppointmentStateTests },
    { name: "dateHelper", fn: runDateHelperTests },
    { name: "priceHelper", fn: runPriceHelperTests },
    { name: "validator", fn: runValidatorTests },
    { name: "tokenHelper", fn: runTokenHelperTests },
    { name: "idempotency", fn: runIdempotencyTests },
    { name: "queryParser", fn: runQueryParserTests },
    { name: "errorHandler", fn: runErrorHandlerTests },
    { name: "rateLimiter", fn: runRateLimiterTests },
    { name: "logger", fn: runLoggerTests },
    { name: "appointmentService", fn: runAppointmentServiceTests },
    { name: "serviceService", fn: runServiceServiceTests },
    { name: "userService", fn: runUserServiceTests },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const ok = t.fn();
      if (ok) {
        passed++;
        console.log(`✅ ${t.name}: PASSED`);
      } else {
        failed++;
        console.log(`❌ ${t.name}: FAILED`);
      }
    } catch (err: any) {
      failed++;
      console.log(`❌ ${t.name}: EXCEPTION - ${err.message}`);
    }
  }

  console.log("\n==========================================");
  console.log(`UNIT TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runAllUnitTests();
}
