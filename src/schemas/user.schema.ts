export const userSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        phoneVerified: { type: "boolean" },
        emailVerified: { type: "boolean" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
    },
};