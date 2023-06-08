import { CustomerInfo } from "../models/order/customer_info";
import { DevicePassword } from "../models/order/device_password";


export type NewOrder = {
    customerInfo: CustomerInfo;
    categoryId: string;
    issueIds: string[];
    description: string;
    deviceWet: boolean;
    wetDescription?: string;
    accesoriesIncluded: boolean;
    accesoriesDescription?: string;
    hasWaranty: boolean;
    password?: DevicePassword;
}