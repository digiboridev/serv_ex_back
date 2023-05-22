import { UserModel } from "../models/user";

export class UserService {
    static async getUserById(id: string) {
        return await UserModel.findById(id);
    }

    static async getUserByLogin(login: string) {
        return await UserModel.findOne({ login: login });
    }

    static async createUser(name: string, login: string, password: string, phone: string, email: string) {
        return await UserModel.create({ name: name, login: login, password: password, phone: phone, email: email });
    }
}
