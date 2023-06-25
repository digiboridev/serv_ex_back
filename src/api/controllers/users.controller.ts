import { User } from "../../domain/entities/user";
import { UsersService } from "../../domain/services/users.service";

export class UsersController {
    static async getUserById(userId: string): Promise<User> {
        return UsersService.userById(userId);
    }

    static async findUserByPhoneOrEmail(phoneOrEmail: string): Promise<User> {
        return UsersService.userByPhoneOrEmail(phoneOrEmail);
    }

    static async searchUsers(query: string): Promise<User[]> {
        return UsersService.searchUsers(query);
    }
}