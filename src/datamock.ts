import { UserModel } from "./models/user";

export async function fillUsers() {
    await UserModel.create({ firstName: "Petro",lastName : "Cringe", password: "123123", phone: "380508210442", email: "petro@mail.com" });
}
