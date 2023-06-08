export const newOrderSchema = {
    type: "object",
    properties: {
        customerInfo: {
            type: "object",
            properties: {
                customerType: { type: "string", enum: ["personal", "company"] },
                customerId: { type: "string" },
            },
            required: ["customerType", "customerId"],
        },
        categoryId: { type: "string" },
        issueIds: { type: "array", items: { type: "string" } },
        description: { type: "string" },
        deviceWet: { type: "boolean" },
        wetDescription: { type: "string" },
        accesoriesIncluded: { type: "boolean" },
        accesoriesDescription: { type: "string" },
        hasWaranty: { type: "boolean" },
        password: {
            oneOf: [
                {
                    type: "object",
                    properties: {
                        type: { type: "string", enum: ["pattern"] },
                        dimensions: { type: "integer", minimum: 2 },
                        points: { type: "array", items: { type: "integer" } },
                    },
                    required: ["type", "dimensions", "points"],
                },
                {
                    type: "object",
                    properties: {
                        type: { type: "string", enum: ["numeric"] },
                        password: { type: "string", minLength: 4 },
                    },
                    required: ["type", "password"],
                },
                {
                    type: "null",
                },
            ],
        },
    },
    required: ["customerInfo", "categoryId", "issueIds", "description", "deviceWet", "accesoriesIncluded", "hasWaranty", "password"],
};
