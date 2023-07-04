import { DevicePassword } from "./device_password";

export type OrderDetails = {
    categoryId: string;
    issueIds: string[];
    description: string;
    deviceWet: boolean;
    wetDescription?: string;
    accesoriesIncluded: boolean;
    accesoriesDescription?: string;
    hasWaranty: boolean;
    password?: DevicePassword;
};
