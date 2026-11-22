import { Service } from "../models/Service";

export class ServiceService {
  static async getActiveServices(category?: string, search?: string) {
    const query: any = { status: "active" };
    if (category && category !== "All") query.category = category;
    if (search && search.trim()) query.serviceName = { $regex: search.trim(), $options: "i" };
    return Service.find(query).sort({ createdAt: -1 });
  }

  static async countActiveServices() {
    return Service.countDocuments({ status: "active" });
  }
}
