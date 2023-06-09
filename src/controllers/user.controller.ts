import { AuthData } from "../models/auth_data";
import { User } from "../models/user";
import { UserContact } from "../models/user_contacts";
import { UserService } from "../services/user.service";
import { ApiError } from "../utils/errors";

export class UserController {
    static async me(authData: AuthData): Promise<User> {
        if (authData.scope !== "client") throw new ApiError("Access denied, only for clients", 403);
        const user = await UserService.getUserById(authData.entityId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    }

    static async userContacts(authData: AuthData): Promise<UserContact[]> {
        if (authData.scope !== "client") throw new ApiError("Access denied, only for clients", 403);
        return UserService.userContacts(authData.entityId);
    }

    static async updateUserContacts(authData: AuthData, contacts: { firstName: string; lastName: string; phone: string }[]): Promise<UserContact[]> {
        if (authData.scope !== "client") throw new ApiError("Access denied, only for clients", 403);
        return UserService.updateUserContacts(authData.entityId, contacts);
    }
}
