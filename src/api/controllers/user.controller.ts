import { NewUserContact } from "../../domain/dto/new_user_contact";
import { AuthData } from "../../domain/entities/auth_data";
import { AppError } from "../../core/errors";
import { User } from "../../domain/entities/user";
import { UserContact } from "../../domain/entities/user_contacts";
import { SL } from "../../core/service_locator";

export class UserController {
    static async me(authData: AuthData): Promise<User> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        const user = await SL.usersRepository.userById(authData.entityId);
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    static async contacts(authData: AuthData): Promise<UserContact[]> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        return SL.usersRepository.userContacts(authData.entityId);
    }

    static async updateContacts(authData: AuthData, contacts: NewUserContact[]): Promise<UserContact[]> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        return SL.usersRepository.updateUserContacts(authData.entityId, contacts);
    }
}
