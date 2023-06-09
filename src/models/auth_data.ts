export type Entity = {
    id: string;
    scope: "client" | "vendor";
};

export type ClientAuthData = {
    scope: "client";
    entityId: string;
    companiesIds: string[];
};

export type VendorAuthData = {
    scope: "vendor";
    entityId: string;
    entityRole: "employee" | "admin";
};

export type AuthData = ClientAuthData | VendorAuthData;
