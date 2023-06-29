import { AppError } from "../../../core/errors";
import { NewCompany } from "../../../domain/dto/new_company";
import { Company } from "../../../domain/entities/company";
import { CompaniesRepository } from "../../../domain/repositories/companies.repository";
import { prisma } from "../client";

export class CompaniesRepositoryPostgressImpl implements CompaniesRepository {
    async createCompany(newCompany: NewCompany): Promise<Company> {
        const company = await prisma.company.create({
            data: {
                name: newCompany.name,
                email: newCompany.email,
                publicId: newCompany.publicId,
                members: {
                    create: newCompany.membersIds.map((id) => ({ userId: id })),
                },
            },
        });

        return company;
    }

    async updateMembers(id: string, membersIds: string[]): Promise<void> {
        await prisma.companyMembers.deleteMany({
            where: {
                companyId: id,
            },
        });

        await prisma.companyMembers.createMany({
            data: membersIds.map((id) => ({ userId: id, companyId: id })),
        });
    }

    async getCompanyById(id: string): Promise<Company> {
        const company = await prisma.company.findUnique({
            where: {
                id,
            },
        });

        if (!company) throw new AppError("Company not found", 404);
        return company;
    }

    async getCompaniesByMemberId(userId: string): Promise<Company[]> {
        const companies = await prisma.company.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
        });

        return companies;
    }
}
