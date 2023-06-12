import { NewCompany } from "../dto/new_company";
import { AuthData } from "../models/auth_data";
import { Company, CompanyModel } from "../models/company";
import { AppError } from "../utils/errors";

export class CompanyService {
    /** Create a new company */
    static async createCompany(newCompany: NewCompany): Promise<Company> {
        const company = await CompanyModel.create(newCompany);
        return company.toObject();
    }

    /** Update the members of a company */
    static async updateMembers(id: string, membersIds: string[]): Promise<Company> {
        const company = await CompanyModel.findByIdAndUpdate(id, { membersIds });
        if (!company) throw new AppError("Company not found", 404);
        return company.toObject();
    }

    /** Get a company by id */
    static async getCompanyById(id: string): Promise<Company> {
        const company = await CompanyModel.findById(id);
        if (!company) throw new AppError("Company not found", 404);
        return company.toObject();
    }

    /** Get all companies where the user is a member */
    static async getCompaniesByMemberId(userId: string): Promise<Company[]> {
        const companies = await CompanyModel.find({ membersIds: userId });
        return companies.map((company) => company.toObject());
    }

    /** Check if the user can edit a company by checking the scope and role */
    static async canEditCompanyOrError(companyId: string, authData: AuthData): Promise<true | AppError> {
        // Check if the client user is a member of the company
        if (authData.scope === "client" && !authData.companiesIds.includes(companyId)) {
            // Check if the user is a member of the company manually
            // because the user can be a member of the company but not have up to date auth payload
            const company = await this.getCompanyById(companyId);
            if (!company) return new AppError("Company not found", 404);
            if (!company.membersIds.includes(authData.entityId)) return new AppError("Access denied, you are not a member of this company", 403);
        }

        // Check if the vendor user is an admin
        if (authData.scope === "vendor" && authData.entityRole !== "admin") {
            return new AppError("Access denied, only for admins", 403);
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
}
