import { Company, CompanyModel } from "../models/company";

export class CompanyService {
    static async createCompany(name: string, email: string, publicId: string, membersIds: string[]): Promise<Company> {
        const company = await CompanyModel.create({ name, email, publicId, membersIds });
        return company.toObject();
    }

    static async updateMembers(id: string, membersIds: string[]): Promise<Company | null> {
        const company = await CompanyModel.findByIdAndUpdate(id, { membersIds });
        return company?.toObject()?? null;
    }

    static async getCompanyById(id: string): Promise<Company | null> {
        const company = await CompanyModel.findById(id);
        return company?.toObject()?? null;

    }

    static async getCompaniesByMemberId(memberId: string): Promise<Company[]> {
        const companies = await CompanyModel.find({ membersIds: memberId });
        return companies.map((company) => company.toObject());
    }
}
