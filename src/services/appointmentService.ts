import { Appointment } from "../models/Appointment";

export class AppointmentService {
  static async checkSlotConflict(date: string, slot: string, excludeId?: string) {
    const query: any = {
      appointmentDate: date,
      timeSlot: slot,
      status: { $in: ["pending", "confirmed"] },
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Appointment.findOne(query);
  }

  static async getCustomerAppointments(customerId: string) {
    return Appointment.find({ customerId }).populate("serviceId").sort({ createdAt: -1 });
  }
}
