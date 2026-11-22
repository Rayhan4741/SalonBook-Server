import { parsePaginationParams } from "../utils/queryParser";

export function runQueryParserTests(): boolean {
  console.log("Running queryParser unit test...");
  const res = parsePaginationParams({ page: "2", limit: "10" });
  return res.page === 2 && res.limit === 10 && res.skip === 10;
}
