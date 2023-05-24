export const credentialsSchema = {
    type: "object",
    properties: {
        email: { type: "string", minLength: 3, maxLength: 20 },
        phone: { type: "string", minLength: 3, maxLength: 20 },
        password: { type: "string", minLength: 3, maxLength: 20 },
    },
    oneOf: [{ required: ["email"] }, { required: ["phone"] }],
    required: ["password"],
};