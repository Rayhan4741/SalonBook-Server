export function sanitizeString(val: string): string {
  if (typeof val !== "string") return "";
  return val.trim().replace(/[<>]/g, "");
}
