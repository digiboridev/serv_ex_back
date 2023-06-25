import { Model } from "mongoose";
import { CategoryModel } from "../../data/models/category";
import { IssueModel } from "../../data/models/issue";
import { AppError } from "../../core/errors";
import { Category } from "../entities/category";
import { Issue } from "../entities/issue";

export class CatalogService {
    /** Create a new category */
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        const ct = await CategoryModel.create({ name, imageUri, parentId });
        return ct.toObject();
    }

    /** Return a category by id */
    static async categoryById(id: string): Promise<Category> {
        const ct = await CategoryModel.findById(id);
        if (!ct) throw new AppError("Category not found", 404);
        return ct.toObject();
    }

    /** Return a list of categories, by default return only the root categories */
    /** If parentId is provided, return only the child categories that have this parentId */
    static async categories(parentId?: string): Promise<Category[]> {
        const query = parentId ? { parentId: parentId } : { parentId: null };
        const cts = await CategoryModel.find(query);
        return cts.map((ct) => ct.toObject());
    }

    /** Return an issue by id */
    static async issueById(id: string): Promise<Issue> {
        const issue = await IssueModel.findById(id);
        if (!issue) throw new AppError("Issue not found", 404);
        return issue.toObject();
    }

    /** Return a list of issues that belong to a category */
    static async issuesByCategoryId(categoryId: string): Promise<Issue[]> {
        const issues: Issue[] = [];

        const ct = await CategoryModel.findById(categoryId).populate<{ issues: [] }>("issues");
        if (!ct) throw new AppError("Category not found", 404);

        issues.push(...ct.issues.map((i: any) => i.toObject()));
        // Recursively get parent issues
        if (ct.parentId) {
            const parentIssues = await this.issuesByCategoryId(ct.parentId);
            issues.push(...parentIssues);
        }

        return issues;
    }
}
