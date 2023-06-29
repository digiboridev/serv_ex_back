import { AppError } from "../../../core/errors";
import { Category } from "../../../domain/entities/category";
import { Issue } from "../../../domain/entities/issue";
import { CatalogRepository } from "../../../domain/repositories/catalog.repository";
import { CategoryModel } from "../models/category";
import { IssueModel } from "../models/issue";

export class CatalogRepositoryMongoImpl implements CatalogRepository {
    async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        const ct = await CategoryModel.create({ name, imageUri, parentId });
        return ct.toObject();
    }

    async createIssue(title: string, description: string, assignCategoryId?: string): Promise<Issue> {
        if (assignCategoryId) {
            const ct = await CategoryModel.findById(assignCategoryId);
            if (!ct) throw new AppError("Category not found", 404);

            const issue = await IssueModel.create({ title, description });

            ct.issuesIds.push(issue.id);
            await ct.save();
            return issue.toObject();
        } else {
            const issue = await IssueModel.create({ title, description });
            return issue.toObject();
        }
    }

    async assignIssueToCategory(issueId: string, categoryId: string): Promise<void> {
        const ct = await CategoryModel.findById(categoryId);
        if (!ct) throw new AppError("Category not found", 404);

        const issue = await IssueModel.findById(issueId);
        if (!issue) throw new AppError("Issue not found", 404);

        ct.issuesIds.push(issue.id);
        await ct.save();
    }

    async unassignIssueToCategory(issueId: string, categoryId: string): Promise<void> {
        const ct = await CategoryModel.findById(categoryId);
        if (!ct) throw new AppError("Category not found", 404);

        ct.issuesIds = ct.issuesIds.filter((id) => id !== issueId);
        await ct.save();
    }

    async categoryById(id: string): Promise<Category> {
        const ct = await CategoryModel.findById(id);
        if (!ct) throw new AppError("Category not found", 404);
        return ct.toObject();
    }

    async categories(parentId?: string): Promise<Category[]> {
        const query = parentId ? { parentId: parentId } : { parentId: null };
        const cts = await CategoryModel.find(query);
        return cts.map((ct) => ct.toObject());
    }

    async issueById(id: string): Promise<Issue> {
        const issue = await IssueModel.findById(id);
        if (!issue) throw new AppError("Issue not found", 404);
        return issue.toObject();
    }

    async issuesByCategoryId(categoryId: string): Promise<Issue[]> {
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
