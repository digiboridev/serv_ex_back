
export type Session = {
    id: string;
    entityId: string;
    scope: "customer" | "vendor";
    createdAt: Date;
    updatedAt: Date;
};
