import { AppError } from "../../../core/errors";
import { Category } from "../../../domain/entities/category";
import { Issue } from "../../../domain/entities/issue";
import { CatalogRepository } from "../../../domain/repositories/catalog.repository";
import { prisma } from "../client";

export class CatalogRepositoryPostgressImpl implements CatalogRepository {
    async createCategory(name: string, imageUri: string, parentId: string): Promise<Category> {
        const ct = await prisma.category.create({ data: { name: name, imageUri: imageUri, parentId: parentId } });
        return ct;
    }

    async createIssue(title: string, description: string, assignCategoryId?: string): Promise<Issue> {
        if (assignCategoryId) {
            const ct = await prisma.category.findUnique({ where: { id: assignCategoryId } });
            if (!ct) throw new AppError("Category not found", 404);

            const issue = await prisma.issue.create({
                data: {
                    title: title,
                    description: description,
                    issueToCategory: {
                        create: {
                            categoryId: assignCategoryId,
                        },
                    },
                },
            });

            return issue;
        } else {
            const issue = await prisma.issue.create({ data: { title: title, description: description } });
            return issue;
        }
    }

    async assignIssueToCategory(issueId: string, categoryId: string): Promise<void> {
        const issue = await prisma.issue.findUnique({ where: { id: issueId } });
        if (!issue) throw new AppError("Issue not found", 404);

        const ct = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!ct) throw new AppError("Category not found", 404);

        await prisma.issueToCategory.create({ data: { categoryId: categoryId, issueId: issueId } });
    }

    async unassignIssueToCategory(issueId: string, categoryId: string): Promise<void> {
        await prisma.issueToCategory.delete({ where: { issueId_categoryId: { categoryId: categoryId, issueId: issueId } } });
    }

    async categoryById(id: string): Promise<Category> {
        const ct = await prisma.category.findUnique({ where: { id: id } });
        if (!ct) throw new AppError("Category not found", 404);
        return ct;
    }

    async categories(parentId?: string): Promise<Category[]> {
        const cts = await prisma.category.findMany({ where: { parentId: parentId } });
        return cts;
    }

    async issueById(id: string): Promise<Issue> {
        const issue = await prisma.issue.findUnique({ where: { id: id } });
        if (!issue) throw new AppError("Issue not found", 404);
        return issue;
    }

    async issuesByCategoryId(categoryId: string): Promise<Issue[]> {
        const ct = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                issueToCategory: { include: { issue: true } },
                parent: {
                    include: { issueToCategory: { include: { issue: true } } },
                },
            },
        });

        if (!ct) throw new AppError("Category not found", 404);

        const issues = new Set<Issue>();
        ct.issueToCategory.forEach((itc) => {
            issues.add(itc.issue);
        });
        ct.parent?.issueToCategory.forEach((itc) => {
            issues.add(itc.issue);
        });

        return Array.from(issues);
    }
}
