import { Category } from "../models/category";
import { Issue } from "../models/issue";
import { CatalogService } from "../services/catalog.service";
import { AppError } from "../utils/errors";

export class CatalogController {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        return CatalogService.createCategory(name, imageUri, parentId);
    }

    static async getCategoryById(id: string): Promise<Category> {
        const cat = await CatalogService.getCategoryById(id);
        if (!cat) throw new AppError("Category not found", 404);
        return cat;
    }

    static async getCategoryByParentId(parentId: string): Promise<Category> {
        const cat = await CatalogService.getCategoryByParentId(parentId);
        if (!cat) throw new AppError("Category not found", 404);
        return cat;
    }

    static async getCategories(parentId?: string): Promise<Category[]> {
        return CatalogService.getCategories(parentId);
    }

    static async getIssue(id: string): Promise<Issue> {
        const issue = await CatalogService.getIssue(id);
        if (!issue) throw new AppError("Issue not found", 404);
        return issue;
    }

    static async getIssuesByCategory(categoryId: string): Promise<Issue[]> {
        return CatalogService.getIssuesByCategory(categoryId);
    }
}
