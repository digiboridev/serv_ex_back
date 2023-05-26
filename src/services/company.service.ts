import { Company, CompanyModel } from "../models/company";

export class CompanyService {
    static async createCompany(name: string, email: string, publicId: string, members: string[]): Promise<Company> {
        const company = await CompanyModel.create({ name, email, publicId, members });
        return company.toCompany;
    }

    static async updateMembers(id: string, members: string[]) {
        await CompanyModel.findByIdAndUpdate(id, { members });
    }

    static async getCompanyById(id: string): Promise<Company | null> {
        const company = await CompanyModel.findById(id);
        if (company) return company.toCompany;
        return null;
    }

    static async getCompaniesByMemberId(memberId: string): Promise<Company[]> {
        const companies = await CompanyModel.find({ members: memberId });
        return companies.map((company) => company.toCompany);
    }
}
