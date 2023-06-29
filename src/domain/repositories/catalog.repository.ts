import { Category } from "../entities/category";
import { Issue } from "../entities/issue";

export interface CatalogRepository {
    /** Create a new category */
    createCategory(name: string, imageUri: string, parentId: string): Promise<Category>;

    /** Create a new issue */
    createIssue(title: string, description: string, assignCategoryId?: string): Promise<Issue>;

    /** Assign an issue to a category */
    assignIssueToCategory(issueId: string, categoryId: string): Promise<void>;

    /** Unassign an issue from a category */
    unassignIssueToCategory(issueId: string, categoryId: string): Promise<void>;

    /** Return a category by id */
    categoryById(id: string): Promise<Category>;

    /** Return a list of categories, by default return only the root categories */
    /** If parentId is provided, return only the child categories that have this parentId */
    categories(parentId?: string): Promise<Category[]>;

    /** Return an issue by id */
    issueById(id: string): Promise<Issue>;

    /**
     * Get all issues that belong to a category
     * @param categoryId the id of the category
     * @returns a list of issues that belong to a category includes the issues of the parent categories
     */
    issuesByCategoryId(categoryId: string): Promise<Issue[]>;
}
