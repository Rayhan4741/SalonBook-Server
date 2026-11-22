export interface ServiceFeedback { appointmentId: string; rating: number; review?: string; }
export function validateFeedbackScore(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
