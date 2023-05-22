import { UserModel } from "./models/user";

export async function fillUsers() {
    await UserModel.create({ name: "Petro", password: "123123", phone: "123123", email: "petro@mail.com" });
    await UserModel.create({ name: "Ivan", password: "3333", phone: "123124", email: "ivan@mail.com" });
}
