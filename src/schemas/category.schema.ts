export const categorySchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" },
        imageUri: { type: "string" },
        parentId: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
    },
};