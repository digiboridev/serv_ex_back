import { NewUser } from "../dto/new_user";
import { NewUserContact } from "../dto/new_user_contact";
import { User } from "../entities/user";
import { UserContact } from "../entities/user_contacts";

export interface UsersRepository {
    /** Get user by id */
    userById(id: string): Promise<User>;

    /** Get user by phone */
    userByPhone(phone: string): Promise<User>;

    /** Get user by email */
    userByEmail(email: string): Promise<User>;

    /**
     * Find one user by phone or email
     * @param phoneOrEmail phone or email
     * @returns a user that matches the phone or email
     */
    userByPhoneOrEmail(phoneOrEmail: string): Promise<User>;

    /**
     * Search by first name, last name, phone, email
     * @param query a string to search for
     * @returns a list of users that match the query
     */
    searchUsers(query: string): Promise<User[]>;

    /** Create a new user */
    createUser(newUser: NewUser): Promise<User>;

    /** Return list of user contacts */
    userContacts(userId: string): Promise<UserContact[]>;

    /** Update user contacts and return updated list of user contacts */
    updateUserContacts(userId: string, contacts: NewUserContact[]): Promise<UserContact[]>;
}
