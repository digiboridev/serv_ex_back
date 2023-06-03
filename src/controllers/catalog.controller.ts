import { Category } from "../models/category";
import { Issue } from "../models/issue";
import { CatalogService } from "../services/catalog.service";

export class CatalogController {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        return CatalogService.createCategory(name, imageUri, parentId);
    }

    static async getCategoryById(id: string): Promise<Category | null> {
        return CatalogService.getCategoryById(id);
    }

    static async getCategoryByParentId(parentId: string): Promise<Category | null> {
        return CatalogService.getCategoryByParentId(parentId);
    }

    static async getCategories(parentId?: string): Promise<Category[]> {
        return CatalogService.getCategories(parentId);
    }

    static async getIssue(id: string): Promise<Issue | null> {
        return CatalogService.getIssue(id);
    }

    static async getIssuesByCategory(categoryId: string): Promise<Issue[]> {
        return CatalogService.getIssuesByCategory(categoryId);
    }
}