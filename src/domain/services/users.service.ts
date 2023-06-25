import { NewUser } from "../dto/new_user";
import { NewUserContact } from "../dto/new_user_contact";
import { UserModel } from "../../data/models/user";
import { UserContactModel } from "../../data/models/user_contacts";
import { AppError } from "../../core/errors";
import { User } from "../entities/user";
import { UserContact } from "../entities/user_contacts";

export class UsersService {
    /** Get user by id */
    static async userById(id: string): Promise<User> {
        const user = await UserModel.findById(id);
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    /** Get user by phone */
    static async userByPhone(phone: string): Promise<User> {
        const user = await UserModel.findOne({ phone: phone });
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    /** Get user by email */
    static async userByEmail(email: string): Promise<User> {
        const user = await UserModel.findOne({ email: email });
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    /**
     * Find one user by phone or email
     * @param phoneOrEmail phone or email
     * @returns a user that matches the phone or email
     */
    static async userByPhoneOrEmail(phoneOrEmail: string): Promise<User> {
        const user = await UserModel.findOne({ $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] });
        if (!user) throw new AppError("User not found", 404);
        return user.toObject();
    }

    /**
     * Search by first name, last name, phone, email
     * @param query a string to search for
     * @returns a list of users that match the query
     */
    static async searchUsers(query: string): Promise<User[]> {
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

    /** Create a new user */
    static async createUser(newUser: NewUser): Promise<User> {
        const user = await UserModel.create(newUser);
        return user.toObject();
    }

    /** Return list of user contacts */
    static async userContacts(userId: string): Promise<UserContact[]> {
        const contacts = await UserContactModel.find({ userId });
        return contacts.map((contact) => contact.toObject());
    }

    /** Update user contacts and return updated list of user contacts */
    static async updateUserContacts(userId: string, contacts: NewUserContact[]): Promise<UserContact[]> {
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
