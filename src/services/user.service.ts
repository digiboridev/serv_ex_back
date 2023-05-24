import { User, UserCredentials, UserData, UserModel } from "../models/user";

export class UserService {
    static async getUserDataById(id: string): Promise<UserData | null> {
        return await UserModel.findById(id);
    }

    static async getUserDataByPhone(phone: string): Promise<UserData | null> {
        return await UserModel.findOne({ phone: phone });
    }

    static async getUserDataByEmail(email: string): Promise<UserData | null> {
        return await UserModel.findOne({ email: email });
    }

    static async getUserCredentialsByPhone(phone: string): Promise<UserCredentials | null> {
        return await UserModel.findOne({ phone: phone }).select("password phone email");
    }

    static async getUserCredentialsByEmail(email: string): Promise<UserCredentials | null> {
        return await UserModel.findOne({ email: email }).select("password phone email");
    }

    static async createUser(name: string, phone: string, email: string, password: string): Promise<UserData> {
        return await UserModel.create({ name: name, phone: phone, email: email, password: password });
    }
}
