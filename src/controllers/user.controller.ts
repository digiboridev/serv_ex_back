import { NewUserContact } from "../dto/new_user_contact";
import { AuthData } from "../models/auth_data";
import { User } from "../models/user";
import { UserContact } from "../models/user_contacts";
import { UsersService } from "../services/users.service";
import { AppError } from "../utils/errors";

export class UserController {
    static async me(authData: AuthData): Promise<User> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        const user = await UsersService.userById(authData.entityId);
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    static async contacts(authData: AuthData): Promise<UserContact[]> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        return UsersService.userContacts(authData.entityId);
    }

    static async updateContacts(authData: AuthData, contacts: NewUserContact[]): Promise<UserContact[]> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        return UsersService.updateUserContacts(authData.entityId, contacts);
    }
}
