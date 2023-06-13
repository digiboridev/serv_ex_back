import { NewCompany } from "../dto/new_company";
import { AuthData } from "../models/auth_data";
import { Company } from "../models/company";
import { CompanyService } from "../services/company.service";
import { AppError } from "../utils/errors";

export class CompaniesController {
    static async createCompany(newCompany: NewCompany, authData: AuthData): Promise<Company> {
        // Check if the user can create a company
        const canCreateCompanyOrError = CompanyService.canCreateCompanyOrError(authData);
        if (canCreateCompanyOrError !== true) throw canCreateCompanyOrError;

        // Add the clientid who created the company to the members list
        if (authData.scope === "customer" && !newCompany.membersIds.includes(authData.entityId))newCompany.membersIds.push(authData.entityId);

        return CompanyService.createCompany(newCompany);
    }

    static async updateMembers(companyId: string, membersIds: string[], authData: AuthData): Promise<Company | null> {
        if (membersIds.length === 0) throw new AppError("Members list cannot be empty", 400);

        // Check if the user can edit the company
        const canEditCompanyOrError = await CompanyService.canEditCompanyOrError(companyId, authData);
        if (canEditCompanyOrError !== true) throw canEditCompanyOrError;

        return CompanyService.updateMembers(companyId, membersIds);
    }

    static async getCompanyById(companyId: string): Promise<Company | null> {
        return CompanyService.getCompanyById(companyId);
    }

    static async getUserCompanies(authData: AuthData): Promise<Company[]> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        return CompanyService.getCompaniesByMemberId(authData.entityId);
    }
}
