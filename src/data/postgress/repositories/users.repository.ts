import { AppError } from "../../../core/errors";
import { NewUser } from "../../../domain/dto/new_user";
import { NewUserContact } from "../../../domain/dto/new_user_contact";
import { User } from "../../../domain/entities/user";
import { UserContact } from "../../../domain/entities/user_contacts";
import { UsersRepository } from "../../../domain/repositories/users.repository";
import { prisma } from "../client";

export class UsersRepositoryPostgressImpl implements UsersRepository {
    async userById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    async userByPhone(phone: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    async userByEmail(email: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    async userByPhoneOrEmail(phoneOrEmail: string): Promise<User> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
            },
        });
        if (!user) throw new AppError("User not found", 404);
        return user;
    }

    async searchUsers(query: string): Promise<User[]> {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
            },
        });

        return users;
    }

    async createUser(newUser: NewUser): Promise<User> {
        const user = await prisma.user.create({ data: newUser });
        return user;
    }

    async userContacts(userId: string): Promise<UserContact[]> {
        const contacts = await prisma.userContact.findMany({ where: { userId } });
        return contacts;
    }

    async updateUserContacts(userId: string, contacts: NewUserContact[]): Promise<UserContact[]> {
        await prisma.userContact.deleteMany({ where: { userId } });
        const newContacts = await prisma.userContact.createMany({
            data: contacts.map((contact) => {
                return {
                    userId,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                };
            }),
        });
        return this.userContacts(userId);
    }
}
