import { NewOrder } from "../dto/new_order";
import { AuthData } from "../models/auth_data";
import { CustomerInfo } from "../models/order/customer_info";
import { Order } from "../models/order/order";
import { CompanyService } from "../services/company.service";
import { OrderService } from "../services/order.service";
import { AppError } from "../utils/errors";

export class OrderController {

    static async getCustomerOrders(authData: AuthData, customerInfo: CustomerInfo): Promise<Order[]> {
        if (authData.scope !== "client") throw new AppError("Permission denied, clients only", 403);

        if (customerInfo.customerType === "company" && !authData.companiesIds.includes(customerInfo.customerId)) {
            throw new AppError(`You are not a member of company ${customerInfo.customerId}`, 403);
        }

        if (customerInfo.customerType === "personal" && customerInfo.customerId !== authData.entityId) {
            throw new AppError("You can not get orders for another client", 403);
        }

        return await OrderService.getCustomerOrders(customerInfo.customerId);
    }

    static async getCustomerOrderById(authData: AuthData, orderId: string): Promise<Order | null> {
        if (authData.scope !== "client") throw new AppError("Permission denied, clients only", 403);

        const order = await OrderService.getOrderById(orderId);
        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.customerInfo.customerType === "company" && !authData.companiesIds.includes(order.customerInfo.customerId)) {
        }

        if (order.customerInfo.customerType === "personal" && order.customerInfo.customerId !== authData.entityId) {
            throw new AppError("You can not get order for another person", 403);
        }

        return order;
    }

    static async createCustomerOrder(authData: AuthData, order: NewOrder): Promise<Order> {
        if (authData.scope !== "client") throw new AppError("Permission denied, clients only", 403);

        if (order.customerInfo.customerType === "company" && !authData.companiesIds.includes(order.customerInfo.customerId)) {
            throw new AppError(`You are not a member of company ${order.customerInfo.customerId}`, 403);
        }

        if (order.customerInfo.customerType === "personal" && order.customerInfo.customerId !== authData.entityId) {
            throw new AppError("You can not create order for another person", 403);
        }

        return await OrderService.createOrder(order);
    }

}
