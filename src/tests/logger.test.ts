import { logger } from "../utils/logger";

export function runLoggerTests(): boolean {
  console.log("Running logger unit test...");
  logger.info("Test info message");
  return true;
}
