import { Company, CompanyModel } from "../models/company";

export class CompanyService {
    static async createCompany(name: string, email: string, publicId: string, members: string[]): Promise<Company> {
        const company = await CompanyModel.create({ name, email, publicId, members });
        return company.toEntity;
    }

    static async updateMembers(id: string, members: string[]): Promise<Company | null> {
        const company = await CompanyModel.findByIdAndUpdate(id, { members });
        if (company) return company.toEntity;
        return null;
    }

    static async getCompanyById(id: string): Promise<Company | null> {
        const company = await CompanyModel.findById(id);
        if (company) return company.toEntity;
        return null;
    }

    static async getCompaniesByMemberId(memberId: string): Promise<Company[]> {
        const companies = await CompanyModel.find({ members: memberId });
        return companies.map((company) => company.toEntity);
    }
}
