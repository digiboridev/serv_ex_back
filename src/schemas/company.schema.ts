export const companySchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        publicId: { type: "string" },
        membersIds: { type: "array", items: { type: "string" } },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
    },
};

export const companyCreateSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        publicId: { type: "string" },
    },
    required: ["name", "email", "publicId"],
};


