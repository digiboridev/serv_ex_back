import { Model } from "mongoose";
import { CategoryModel, Category } from "../models/category";
import { Issue, IssueModel } from "../models/issue";

export class CatalogService {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        const ct = await CategoryModel.create({ name, imageUri, parentId });
        return ct.toObject();
    }

    static async getCategoryById(id: string): Promise<Category | null> {
        const ct = await CategoryModel.findById(id);
        return ct?.toObject() ?? null;
    }

    static async getCategoryByParentId(parentId: string): Promise<Category | null> {
        const ct = await CategoryModel.findOne({ parentId: parentId });
        return ct?.toObject() ?? null;
    }

    static async getCategories(parentId?: string): Promise<Category[]> {
        const query = parentId ? { parentId: parentId } : { parentId: null };
        const cts = await CategoryModel.find(query);
        return cts.map((ct) => ct.toObject());
    }

    static async getIssue(id: string): Promise<Issue | null> {
        const issue = await IssueModel.findById(id);
        return issue?.toObject() ?? null;
    }

    static async getIssuesByCategory(categoryId: string): Promise<Issue[]> {
        const issues: Issue[] = [];

        const ct = await CategoryModel.findById(categoryId).populate<{issues:[]}>("issues");
        if (ct) {
            issues.push(...ct.issues.map((i:any) => i.toObject()));
            if (ct.parentId) {
                const parentIssues = await this.getIssuesByCategory(ct.parentId);
                issues.push(...parentIssues);
            }
        }
        return issues;
    }
}
