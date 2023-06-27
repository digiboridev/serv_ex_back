import { AuthData, ClientAuthData } from "../entities/auth_data";
import { AppError } from "../../core/errors";
import { SL } from "../../core/service_locator";

export class CompanyService {
    /** Check if the user can edit a company by checking the scope and role */
    static async canEditCompanyOrError(companyId: string, authData: AuthData): Promise<true | AppError> {
        // Check if the client able to edit the company
        if (authData.scope === "customer") {
            const isMember = await this.isCompanyMember(companyId, authData);
            if (!isMember) return new AppError("Access denied, you are not a member of this company", 403);
        }

        // Check if the vendor able to edit the company
        if (authData.scope === "vendor") {
            if (authData.entityRole !== "admin") return new AppError("Access denied, only for admins", 403);
        }

        return true;
    }

    /** Check if the user can create a company by checking the scope and role */
    static canCreateCompanyOrError(authData: AuthData): true | AppError {
        // Check if the vendor user is an admin
        if (authData.scope === "vendor" && authData.entityRole !== "admin") {
            return new AppError("Access denied, only for admins", 403);
        }

        return true;
    }

    /** Check if the user is a member of a company */
    static async isCompanyMember(companyId: string, authData: ClientAuthData): Promise<boolean> {
        // Check if the client user is a member of the company from the auth payload
        if (authData.companiesIds.includes(companyId)) return true;

        // Check if the user is a member of the company manually
        // because the user can be a member of the company but not have up to date auth payload
        const company = await SL.companiesRepository.getCompanyById(companyId);
        if (company.membersIds.includes(authData.entityId)) return true;

        return false;
    }
}
