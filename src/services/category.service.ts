import { CategoryModel, Category } from "../models/category";

export class CategoryService {
    static async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        const ct = await CategoryModel.create({ name, imageUri, parentId });
        return ct.toEntity;
    }

    static async getCategoryById(id: string): Promise<Category | null> {
        const ct = await CategoryModel.findById(id);
        return ct?.toEntity ?? null;
    }

    static async getCategoryByParentId(parentId: string): Promise<Category | null> {
        const ct = await CategoryModel.findOne({ parentId: parentId });
        return ct?.toEntity ?? null;
    }

    static async getCategories(parentId?: string): Promise<Category[]> {
        const query = parentId ? { parentId: parentId } : {parentId: null};
        const cts = await CategoryModel.find(query);
        return cts.map((ct) => ct.toEntity);
    }
}
