export type Entity = {
    id: string;
    scope: "customer" | "vendor";
};

export type ClientAuthData = {
    scope: "customer";
    entityId: string;
    companiesIds: string[];
};

export type VendorAuthData = {
    scope: "vendor";
    entityId: string;
    entityRole: "employee" | "admin";
};

export type AuthData = ClientAuthData | VendorAuthData;
