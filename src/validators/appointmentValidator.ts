import { isValidDateString, isUpcomingDate } from "../utils/dateHelper";
import { SALON_TIME_SLOTS } from "../constants/salon";

export function validateAppointmentInput(data: any): string | null {
  if (!data.serviceId) return "serviceId is required.";
  if (!isValidDateString(data.appointmentDate)) return "appointmentDate must be YYYY-MM-DD.";
  if (!isUpcomingDate(data.appointmentDate)) return "Cannot book past dates.";
  if (!SALON_TIME_SLOTS.includes(data.timeSlot)) return "Invalid time slot selected.";
  return null;
}
