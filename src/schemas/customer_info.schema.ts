export const customerInfoSchema = {
    oneOf: [
        {
            type: "object",
            properties: {
                customerId: { type: "null" },
                customerType: { type: "null" },
            },
        },
        {
            type: "object",
            properties: {
                customerType: { type: "string", enum: ["personal", "company"] },
                customerId: { type: "string" },
            },
            required: ["customerType", "customerId"],
        },
    ],
};