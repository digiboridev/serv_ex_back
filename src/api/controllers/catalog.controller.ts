import { SL } from "../../core/service_locator";
import { Category } from "../../domain/entities/category";
import { Issue } from "../../domain/entities/issue";

export class CatalogController {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        return SL.catalogRepository.createCategory(name, imageUri, parentId);
    }

    static async categoryById(id: string): Promise<Category> {
        return SL.catalogRepository.categoryById(id);
    }

    static async categories(parentId?: string): Promise<Category[]> {
        return SL.catalogRepository.categories(parentId);
    }

    static async issueById(id: string): Promise<Issue> {
        return SL.catalogRepository.issueById(id);
    }

    static async issuesByCategoryId(categoryId: string): Promise<Issue[]> {
        return SL.catalogRepository.issuesByCategoryId(categoryId);
    }
}
