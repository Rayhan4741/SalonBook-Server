export function validateRequiredFields(obj: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || (typeof obj[field] === "string" && !obj[field].trim())) {
      return `The field '${field}' is required and cannot be empty.`;
    }
  }
  return null;
}
