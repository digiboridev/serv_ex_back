import { User } from "../models/user";
import { UserService } from "../services/user.service";
import { AppError } from "../utils/errors";

export class UsersController {
    static async getUserById(userId: string): Promise<User> {
        const user = await UserService.getUserById(userId);
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    static async findUserByPhoneOrEmail(phoneOrEmail: string): Promise<User> {
        const user = await UserService.findUserByPhoneOrEmail(phoneOrEmail);
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    static async searchUsers(query: string): Promise<User[]> {
        return UserService.searchUsers(query);
    }
}
