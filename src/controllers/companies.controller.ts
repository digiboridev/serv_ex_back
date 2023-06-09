import { AuthData } from "../models/auth_data";
import { Company } from "../models/company";
import { CompanyService } from "../services/company.service";
import { ApiError } from "../utils/errors";

export class CompaniesController {
    static async createCompany(name: string, email: string, publicId: string, membersIds: string[], authData: AuthData): Promise<Company> {
        const companiesSet = new Set(membersIds);

        if (authData.scope === "client") {
            companiesSet.add(authData.entityId);
        }

        if (authData.scope === "vendor" && authData.entityRole !== "admin") {
            throw new ApiError("Access denied, only for admins", 403);
        }

        return CompanyService.createCompany(name, email, publicId, Array.from(companiesSet));
    }

    static async updateMembers(companyId: string, membersIds: string[], authData: AuthData): Promise<Company | null> {
        if (authData.scope === "client" && !authData.companiesIds.includes(companyId)) {
            throw new ApiError("Access denied, you are not a member of this company", 403);
        }
        if (authData.scope === "vendor" && authData.entityRole !== "admin") {
            throw new ApiError("Access denied, only for admins", 403);
        }
        return CompanyService.updateMembers(companyId, membersIds);
    }

    static async getCompanyById(companyId: string): Promise<Company | null> {
        return CompanyService.getCompanyById(companyId);
    }

    static async getUserCompanies(authData: AuthData): Promise<Company[]> {
        if (authData.scope !== "client") throw new ApiError("Access denied, only for clients", 403);
        return CompanyService.getCompaniesByMemberId(authData.entityId);
    }
}
