import { Category } from "../models/category";
import { Issue } from "../models/issue";
import { CatalogService } from "../services/catalog.service";
import { AppError } from "../utils/errors";

export class CatalogController {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        return CatalogService.createCategory(name, imageUri, parentId);
    }

    static async categoryById(id: string): Promise<Category> {
        return CatalogService.categoryById(id);
    }

    static async categories(parentId?: string): Promise<Category[]> {
        return CatalogService.categories(parentId);
    }

    static async issueById(id: string): Promise<Issue> {
        return CatalogService.issueById(id);
    }

    static async issuesByCategoryId(categoryId: string): Promise<Issue[]> {
        return CatalogService.issuesByCategoryId(categoryId);
    }
}
