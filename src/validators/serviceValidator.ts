export function validateServiceInput(data: any): string | null {
  if (!data.serviceName?.trim()) return "Service name is required.";
  if (!data.category?.trim()) return "Category is required.";
  if (isNaN(Number(data.price)) || Number(data.price) < 0) return "Price must be a positive number.";
  if (isNaN(Number(data.duration)) || Number(data.duration) <= 0) return "Duration must be greater than 0.";
  if (!data.image?.trim()) return "Service image is required.";
  return null;
}
