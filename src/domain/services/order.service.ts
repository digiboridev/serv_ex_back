import { CancellOrderDto } from "../dto/cancell_order";
import { NewOrder } from "../dto/new_order";
import { AuthData } from "../entities/auth_data";
import { AppError } from "../../core/errors";
import { CompanyService } from "./company.service";
import { SL } from "../../core/service_locator";
import { OrderModel } from "../../data/models/order/order";
import { CustomerInfo } from "../entities/order/customer_info";
import { Order } from "../entities/order/order";
import { OrderStatusType } from "../entities/order/order_status";

export class OrderService {
    /**
     * Create new order
     * @param order - dto with order data
     * @returns Newly created order
     */
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
        SL.pubSub.publish("orders", newOrder.toObject());
        return newOrder.toObject();
    }

    /** Get orders for specific customer or for all customers if customerId is not provided */
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

    /**
     * Cancel order
     * @param cancelldata - cancellation data
     * @param authData - auth data of user who is cancelling order
     * @returns Cancelled order
     */
    static async cancelOrder(cancelldata: CancellOrderDto, authData: AuthData): Promise<Order> {
        const order = await OrderModel.findById(cancelldata.orderId);
        if (!order) throw new AppError("Order not found", 404);

        const hasAccess = await OrderService.hasAccessToResource(authData, order.customerInfo);
        if (!hasAccess) throw new AppError("Permission denied", 403);

        if (order.status.currentStatus == OrderStatusType.canceled) return order.toObject();

        if (authData.scope == "customer") {
            order.status.currentStatus = OrderStatusType.canceled;
            order.status.cancellDetails = {
                reason: cancelldata.reason,
                description: cancelldata.description,
                actor: "customer",
            };
            await order.save();
            SL.pubSub.publish("orders", order.toObject());
            return order.toObject();
        } else {
            order.status.currentStatus = OrderStatusType.canceled;
            order.status.cancellDetails = {
                reason: cancelldata.reason,
                description: cancelldata.description,
                actor: "employee",
                employeeId: authData.entityId,
            };
            await order.save();
            SL.pubSub.publish("orders", order.toObject());
            return order.toObject();
        }
    }

    /** Check if user can get order */
    static async canGetOrder(order: Order, authData: AuthData): Promise<boolean> {
        return await OrderService.hasAccessToResource(authData, order.customerInfo);
    }

    /** Check if user can create order */
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

    static async watchOrdersUpdates(customerId?: string) {
        return SL.pubSub.subscribe<Order>("orders", (order) => order.customerInfo.customerId == customerId);
    }

    static async watchOrderUpdates(orderId: string) {
        return SL.pubSub.subscribe<Order>("orders", (order) => order.id == orderId);
    }
}
