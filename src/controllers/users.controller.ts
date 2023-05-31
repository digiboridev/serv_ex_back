import { User } from "../models/user";
import { UserContact } from "../models/user_contacts";
import { UserService } from "../services/user.service";

export class UsersController {
    static async getUserById(userId: string): Promise<User | null> {
        return UserService.getUserById(userId);
    }

    static async findUserByPhoneOrEmail(phoneOrEmail: string): Promise<User | null> {
        return UserService.findUserByPhoneOrEmail(phoneOrEmail);
    }

}
