import { AppError } from "../../core/errors";
import { SL } from "../../core/service_locator";
import { NewCompany } from "../../domain/dto/new_company";
import { AuthData } from "../../domain/entities/auth_data";
import { Company } from "../../domain/entities/company";
import { CompanyService } from "../../domain/services/company.service";


export class CompaniesController {
    static async createCompany(newCompany: NewCompany, authData: AuthData): Promise<Company> {
        // Check if the user can create a company
        const canCreateCompanyOrError = CompanyService.canCreateCompanyOrError(authData);
        if (canCreateCompanyOrError !== true) throw canCreateCompanyOrError;

        // Add the clientid who created the company to the members list
        if (authData.scope === "customer" && !newCompany.membersIds.includes(authData.entityId))newCompany.membersIds.push(authData.entityId);

        return SL.companiesRepository.createCompany(newCompany);
    }

    static async updateMembers(companyId: string, membersIds: string[], authData: AuthData): Promise<void> {
        if (membersIds.length === 0) throw new AppError("Members list cannot be empty", 400);

        // Check if the user can edit the company
        const canEditCompanyOrError = await CompanyService.canEditCompanyOrError(companyId, authData);
        if (canEditCompanyOrError !== true) throw canEditCompanyOrError;

        // Add the customer who created the company to the members list
        if (authData.scope === "customer" && !membersIds.includes(authData.entityId))membersIds.push(authData.entityId);

        await SL.companiesRepository.updateMembers(companyId, membersIds);
    }

    static async getCompanyById(companyId: string): Promise<Company | null> {
        return SL.companiesRepository.getCompanyById(companyId);
    }

    static async getUserCompanies(authData: AuthData): Promise<Company[]> {
        if (authData.scope !== "customer") throw new AppError("Access denied, only for clients", 403);
        return SL.companiesRepository.getCompaniesByMemberId(authData.entityId);
    }
}
