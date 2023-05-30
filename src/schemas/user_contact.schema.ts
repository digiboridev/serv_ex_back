export const userContactSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        phone: { type: "string" },
    },
    required: ["id", "firstName", "lastName", "phone"],
};

export const userContactCreateSchema = {
    type: "object",
    properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        phone: { type: "string" },
    },
    required: ["firstName", "lastName", "phone"],
};
