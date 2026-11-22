export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthenticatedUserPayload {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  phone?: string;
}

export interface CreateServiceInput {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status?: "active" | "inactive";
}

export interface CreateAppointmentInput {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
}
