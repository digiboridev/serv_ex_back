import { AppError } from "../../../core/errors";
import { NewUser } from "../../../domain/dto/new_user";
import { NewUserContact } from "../../../domain/dto/new_user_contact";
import { User } from "../../../domain/entities/user";
import { UserContact } from "../../../domain/entities/user_contacts";
import { UsersRepository } from "../../../domain/repositories/users.repository";
import { UserModel } from "../models/user";
import { UserContactModel } from "../models/user_contacts";

export class UsersRepositoryMongoImpl implements UsersRepository {
    async userById(id: string): Promise<User> {
        const user = await UserModel.findById(id);
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    async userByPhone(phone: string): Promise<User> {
        const user = await UserModel.findOne({ phone: phone });
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    async userByEmail(email: string): Promise<User> {
        const user = await UserModel.findOne({ email: email });
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    async userByPhoneOrEmail(phoneOrEmail: string): Promise<User> {
        const user = await UserModel.findOne({ $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] });
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    async searchUsers(query: string): Promise<User[]> {
        const users = await UserModel.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { phone: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
        });

        return users.map((user) => user.toObject());
    }

    async createUser(newUser: NewUser): Promise<User> {
        const user = await UserModel.create(newUser);
        return user.toObject();
    }

    async userContacts(userId: string): Promise<UserContact[]> {
        const contacts = await UserContactModel.find({ userId });
        return contacts.map((contact) => contact.toObject());
    }

    async updateUserContacts(userId: string, contacts: NewUserContact[]): Promise<UserContact[]> {
        await UserContactModel.deleteMany({ userId });
        const newContacts = await UserContactModel.insertMany(
            contacts.map((contact) => {
                return {
                    userId,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                };
            })
        );
        return newContacts.map((contact) => contact.toObject());
    }
}
