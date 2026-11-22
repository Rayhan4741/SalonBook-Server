export function cleanCustomerName(name: string): string {
  return name.replace(/[^a-zA-Z\s\-']/g, '').trim();
}
