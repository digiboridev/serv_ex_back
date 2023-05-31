import { Company } from "../models/company";
import { CompanyService } from "../services/company.service";
import { ApiError } from "../utils/errors";

export class CompanyController {
    static async createCompany(name: string, email: string, publicId: string, userId: string): Promise<Company> {
        return CompanyService.createCompany(name, email, publicId, [userId]);
    }

    static async updateMembers(id: string, membersIds: string[], userId: string): Promise<Company | null> {
        const company = await CompanyService.getCompanyById(id);
        if (!company) throw new ApiError("Company not found", 404);
        if (!company.membersIds.includes(userId)) throw new ApiError("You are not a member of this company", 403);
        if (membersIds.length === 0) throw new ApiError("You must provide at least one member", 400);
        return CompanyService.updateMembers(id, membersIds);
    }

    static async getCompanyById(id: string): Promise<Company | null> {
        return CompanyService.getCompanyById(id);
    }

    static async getCompaniesByMemberId(memberId: string): Promise<Company[]> {
        return CompanyService.getCompaniesByMemberId(memberId);
    }
}
