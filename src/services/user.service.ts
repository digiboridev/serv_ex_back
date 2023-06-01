import { User, UserModel } from "../models/user";
import { UserContact, UserContactModel } from "../models/user_contacts";

export class UserService {
    static async getUserById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        if (user) return user.toEntity;
        return null;
    }

    static async getUserByPhone(phone: string): Promise<User | null> {
        const user = await UserModel.findOne({ phone: phone });
        if (user) return user.toEntity;
        return null;
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email: email });
        if (user) return user.toEntity;
        return null;
    }

    static async findUserByPhoneOrEmail(phoneOrEmail: string): Promise<User | null> {
        const user = await UserModel.findOne({ $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] });
        if (user) return user.toEntity;
        return null;
    }

    // Search by first name, last name, phone, email
    static async searchUsers(query: string): Promise<User[]> {
        const users = await UserModel.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { phone: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],  
        });

        return users.map((user) => user.toEntity);
    }

    static async createUser(firstName: string, lastName: string, phone: string, email: string, phoneVerified: boolean, emailVerified: boolean): Promise<User> {
        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            phoneVerified: phoneVerified,
            emailVerified: emailVerified,
        });
        return user.toEntity;
    }

    static async userContacts(userId: string): Promise<UserContact[]> {
        const contacts = await UserContactModel.find({ userId });
        return contacts.map((contact) => contact.toEntity);
    }

    static async updateUserContacts(userId: string, contacts: { firstName: string; lastName: string; phone: string }[]): Promise<UserContact[]> {
        const userContacts = contacts.map((contact) => {
            return {
                userId,
                firstName: contact.firstName,
                lastName: contact.lastName,
                phone: contact.phone,
            };
        });
        await UserContactModel.deleteMany({ userId });
        const newContacts = await UserContactModel.insertMany(userContacts);
        return newContacts.map((contact) => contact.toEntity);
    }
}
