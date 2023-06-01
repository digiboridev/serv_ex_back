import { Category } from "../models/category";
import { CategoryService } from "../services/category.service";

export class CatalogController {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        return CategoryService.createRSCategory(name, imageUri, parentId);
    }

    static async getCategoryById(id: string): Promise<Category | null> {
        return CategoryService.getRSCategoryById(id);
    }

    static async getCategoryByParentId(parentId: string): Promise<Category | null> {
        return CategoryService.getRSCategoryByParentId(parentId);
    }

    static async getCategories(parentId?: string): Promise<Category[]> {
        return CategoryService.getRSCategories(parentId);
    }
}