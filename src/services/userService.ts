import { User } from "../models/User";

export class UserService {
  static async findCustomerById(id: string) {
    return User.findById(id).select("-password");
  }

  static async isUserBlocked(id: string): Promise<boolean> {
    const user = await User.findById(id).select("isBlocked");
    return !!user?.isBlocked;
  }
}
