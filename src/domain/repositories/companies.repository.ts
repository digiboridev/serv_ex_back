import { NewCompany } from "../dto/new_company";
import { Company } from "../entities/company";

export interface CompaniesRepository {
    /** Create a new company */
    createCompany(newCompany: NewCompany): Promise<Company>;
    /** Update the members of a company */
    updateMembers(id: string, membersIds: string[]): Promise<void>;

    /** Get a company by id */
    getCompanyById(id: string): Promise<Company>;

    /** Get all companies where the user is a member */
    getCompaniesByMemberId(userId: string): Promise<Company[]>;
}
