import { User } from "../models/user";
import { UserContact } from "../models/user_contacts";
import { UserService } from "../services/user.service";

export class UserController {
    static async getUserById(userId: string): Promise<User | null> {
        return UserService.getUserById(userId);
    }

    static async userContacts(userId: string): Promise<UserContact[]> {
        return UserService.userContacts(userId);
    }

    static async updateUserContacts(userId: string, contacts: { firstName: string; lastName: string; phone: string }[]): Promise<UserContact[]> {
        return UserService.updateUserContacts(userId, contacts);
    }

    static async findUserByPhoneOrEmail(phoneOrEmail: string): Promise<User | null> {
        return UserService.findUserByPhoneOrEmail(phoneOrEmail);
    }
}
