export function validateProfileUpdate(data: any): string | null {
  if (data.role !== undefined || data.isBlocked !== undefined) {
    return "Modifying role or blocked status is strictly prohibited.";
  }
  return null;
}
