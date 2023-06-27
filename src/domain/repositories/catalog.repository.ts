import { Category } from "../entities/category";
import { Issue } from "../entities/issue";

export interface CatalogRepository {
    /** Create a new category */
    createCategory(name: string, imageUri: string, parentId: string): Promise<Category>;

    /** Return a category by id */
    categoryById(id: string): Promise<Category>;

    /** Return a list of categories, by default return only the root categories */
    /** If parentId is provided, return only the child categories that have this parentId */
    categories(parentId?: string): Promise<Category[]>;

    /** Return an issue by id */
    issueById(id: string): Promise<Issue>;

    /** Return a list of issues that belong to a category */
    issuesByCategoryId(categoryId: string): Promise<Issue[]>;
}
