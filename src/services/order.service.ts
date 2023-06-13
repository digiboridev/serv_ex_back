import { NewOrder } from "../dto/new_order";
import { AuthData } from "../models/auth_data";
import { CustomerInfo } from "../models/order/customer_info";
import { Order, OrderModel } from "../models/order/order";
import { AppError } from "../utils/errors";
import { CompanyService } from "./company.service";

export class OrderService {
    static async createOrder(order: NewOrder): Promise<Order> {
        const newOrder = await OrderModel.create({
            customerInfo: order.customerInfo,
            details: {
                categoryId: order.categoryId,
                issueIds: order.issueIds,
                description: order.description,
                deviceWet: order.deviceWet,
                wetDescription: order.wetDescription,
                accesoriesIncluded: order.accesoriesIncluded,
                accesoriesDescription: order.accesoriesDescription,
                hasWaranty: order.hasWaranty,
                password: order.password,
            },
        });
        return newOrder.toObject();
    }

    /**
     * Get orders for specific customer or for all customers if customerId is not provided
     * @param customerId - optional customer id to get orders for specific customer
     * @returns Orders list
     */
    static async orders(customerId?: string): Promise<Order[]> {
        const query = customerId ? { "customerInfo.customerId": customerId } : {};
        const orders = await OrderModel.find(query).sort({ createdAt: -1 });
        return orders.map((order) => order.toObject());
    }

    /** Get order by id */
    static async orderById(orderId: string): Promise<Order> {
        const order = await OrderModel.findById(orderId);
        if (!order) throw new AppError("Order not found", 404);
        return order.toObject();
    }

    // Check if user can get order
    static async canGetOrder(order: Order, authData: AuthData): Promise<boolean> {
        return await OrderService.hasAccessToResource(authData, order.customerInfo);
    }

    // Check if user can create order
    static async canCreateOrder(order: NewOrder, authData: AuthData): Promise<boolean> {
        return await OrderService.hasAccessToResource(authData, order.customerInfo);
    }

    /**
     * Check if user has access to order
     * @param customerInfo - customer info of resource[order or query of orders] to check
     * @param authData - auth data of user who performs action
     * @returns  - true if user has access to order, false otherwise
     */
    static async hasAccessToResource(authData: AuthData, customerInfo: CustomerInfo): Promise<boolean> {
        if (authData.scope === "vendor") return true;

        if (authData.scope === "customer") {
            if (customerInfo.customerType === "personal") {
                const isOwner = customerInfo.customerId === authData.entityId;
                if (isOwner) return true;
            }

            if (customerInfo.customerType === "company") {
                const isMember = await CompanyService.isCompanyMember(customerInfo.customerId, authData);
                if (isMember) return true;
            }
        }

        return false;
    }
}
