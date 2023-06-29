import { CategoryModel } from "./data/mongo/models/category";
import { IssueModel } from "./data/mongo/models/issue";
import { UserModel } from "./data/mongo/models/user";
import { prisma } from "./data/postgress/client";

export async function fillUsers() {
    await UserModel.create({ firstName: "Petro", lastName: "Cringe", password: "123123", phone: "380508210442", email: "petro@mail.com" });
}

export async function fillRsCat() {
    // await IssueModel.deleteMany({});
    // await CategoryModel.deleteMany({});

    // const i0 = await IssueModel.create({ title: "Not working/Global", description: "description0" });
    // const i1 = await IssueModel.create({ title: "Charging problems", description: "description1" });
    // const i2 = await IssueModel.create({ title: "Screen problems", description: "description2" });
    // const i3 = await IssueModel.create({ title: "Battery problems", description: "description3" });
    // const i4 = await IssueModel.create({ title: "Camera problems", description: "description4" });
    // const i5 = await IssueModel.create({ title: "Sound problems", description: "description5" });

    // const c1 = await CategoryModel.create({ name: "Cat 1", parentId: null });
    // const c2 = await CategoryModel.create({ name: "Cat 2", parentId: null, issuesIds: [i0._id] });
    // await CategoryModel.create({ name: "Cat 11", parentId: c1._id, issuesIds: [i1._id, i2._id] });
    // await CategoryModel.create({ name: "Cat 12", parentId: c1._id, issuesIds: [i3._id, i4._id, i5._id] });
    // await CategoryModel.create({ name: "Cat 21", parentId: c2._id, issuesIds: [i5._id] });
    // await CategoryModel.create({ name: "Cat 22", parentId: c2._id, issuesIds: [i1._id, i2._id] });

    await prisma.category.deleteMany({});
    await prisma.issue.deleteMany({});

    const i0 = await prisma.issue.create({ data: { title: "Not working/Global", description: "description0" } });
    const i1 = await prisma.issue.create({ data: { title: "Charging problems", description: "description1" } });
    const i2 = await prisma.issue.create({ data: { title: "Screen problems", description: "description2" } });
    const i3 = await prisma.issue.create({ data: { title: "Battery problems", description: "description3" } });
    const i4 = await prisma.issue.create({ data: { title: "Camera problems", description: "description4" } });
    const i5 = await prisma.issue.create({ data: { title: "Sound problems", description: "description5" } });

    const c1 = await prisma.category.create({ data: { name: "Cat 1", parentId: null } });
    const c2 = await prisma.category.create({ data: { name: "Cat 2", parentId: null, issueToCategory: { create: { issueId: i0.id } } } });
    await prisma.category.create({
        data: { name: "Cat 11", parentId: c1.id, issueToCategory: { createMany: { data: [{ issueId: i1.id }, { issueId: i2.id }] } } },
    });
    await prisma.category.create({
        data: { name: "Cat 12", parentId: c1.id, issueToCategory: { createMany: { data: [{ issueId: i3.id }, { issueId: i4.id }] } } },
    });
    await prisma.category.create({
        data: { name: "Cat 21", parentId: c2.id, issueToCategory: { createMany: { data: [{ issueId: i5.id }, { issueId: i1.id }] } } },
    });
    await prisma.category.create({
        data: { name: "Cat 22", parentId: c2.id, issueToCategory: { createMany: { data: [{ issueId: i2.id }, { issueId: i3.id }] } } },
    });
}
