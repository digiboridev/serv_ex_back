import { CustomerInfo } from "./customer_info";
import { OrderDetails } from "./order_details";
import { OrderStatus } from "./order_status";


export type Order = {
    id: string;
    customerInfo: CustomerInfo;
    details: OrderDetails;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
};

export enum PaymentStatus {
    notPaid = "notPaid",
    paid = "paid",
}

export enum DeviceLocation {
    customer = "customer",
    laboratory = "laboratory",
}
