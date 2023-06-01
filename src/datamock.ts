import { RSCategoryModel } from "./models/category";
import { UserModel } from "./models/user";

export async function fillUsers() {
    await UserModel.create({ firstName: "Petro",lastName : "Cringe", password: "123123", phone: "380508210442", email: "petro@mail.com" });
}


export async function fillRsCat() {
   const c1 = await RSCategoryModel.create({ name: "Cat 1", parentId: null });
   const c2 =  await RSCategoryModel.create({ name: "Cat 2", parentId: null });
    await RSCategoryModel.create({ name: "Cat 11", parentId: c1._id });
    await RSCategoryModel.create({ name: "Cat 12", parentId: c1._id });
    await RSCategoryModel.create({ name: "Cat 21", parentId: c2._id });
    await RSCategoryModel.create({ name: "Cat 22", parentId: c2._id });
}