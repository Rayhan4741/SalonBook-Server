import { signJwtToken, decodeJwtToken } from "../utils/tokenHelper";

export function runTokenHelperTests(): boolean {
  console.log("Running tokenHelper unit test...");
  const token = signJwtToken({ id: "123", email: "test@test.com" }, "test-secret-key-12345");
  const decoded = decodeJwtToken(token);
  return decoded?.id === "123";
}
