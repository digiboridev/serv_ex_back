
export type Category = {
    id: string;
    name: string;
    imageUri?: string;
    parentId?: string;
    issuesIds: string[];
};
