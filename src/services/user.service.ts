import { UserCredentials, UserData, UserModel } from "../models/user";

export class UserService {
    static async getUserDataById(id: string): Promise<UserData | null> {
        const user = await UserModel.findById(id);
        if (user) return user.toUserData;
        return null;
    }

    static async getUserDataByPhone(phone: string): Promise<UserData | null> {
        const user = await UserModel.findOne({ phone: phone });
        if (user) return user.toUserData;
        return null;
    }

    static async getUserDataByEmail(email: string): Promise<UserData | null> {
        const user = await UserModel.findOne({ email: email });
        if (user) return user.toUserData;
        return null;
    }

    static async getUserCredentialsByPhone(phone: string): Promise<UserCredentials | null> {
        const user = await UserModel.findOne({ phone: phone }).select("password phone email");
        if (user) return user.toCredentials;
        return null;
    }

    static async getUserCredentialsByEmail(email: string): Promise<UserCredentials | null> {
        const user = await UserModel.findOne({ email: email }).select("password phone email");
        if (user) return user.toCredentials;
        return null;
    }

    static async createUser(name: string, phone: string, email: string, password: string): Promise<UserData> {
        const user = await UserModel.create({ name: name, phone: phone, email: email, password: password });
        return user.toUserData;
    }
}
