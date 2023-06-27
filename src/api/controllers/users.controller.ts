import { SL } from "../../core/service_locator";
import { User } from "../../domain/entities/user";

export class UsersController {
    static async getUserById(userId: string): Promise<User> {
        return SL.usersRepository.userById(userId);
    }

    static async findUserByPhoneOrEmail(phoneOrEmail: string): Promise<User> {
        return SL.usersRepository.userByPhoneOrEmail(phoneOrEmail);
    }

    static async searchUsers(query: string): Promise<User[]> {
        return SL.usersRepository.searchUsers(query);
    }
}
