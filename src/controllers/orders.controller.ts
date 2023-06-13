import { CancellOrderDto } from "../dto/cancell_order";
import { NewOrder } from "../dto/new_order";
import { AuthData } from "../models/auth_data";
import { CustomerInfo } from "../models/order/customer_info";
import { Order } from "../models/order/order";
import { CancellationReasons } from "../models/order/status_details/cancelled";
import { OrderService } from "../services/order.service";
import { AppError } from "../utils/errors";

export class OrderController {
    static async orders(authData: AuthData, customerInfo?: CustomerInfo): Promise<Order[]> {
        // If customerInfo is specified get orders for that customer
        if (customerInfo) {
            // Check if user has access to that resource
            const hasAccess = await OrderService.hasAccessToResource(authData, customerInfo);
            if (!hasAccess) throw new AppError("Permission denied", 403);
            return await OrderService.orders(customerInfo.customerId);
        }

        // If customerInfo is not specified get all orders for vendor or client orders for client
        if (authData.scope === "customer") {
            return await OrderService.orders(authData.entityId);
        } else {
            return await OrderService.orders();
        }
    }

    static async orderById(authData: AuthData, orderId: string): Promise<Order> {
        const order = await OrderService.orderById(orderId);
        const canGetOrder = await OrderService.canGetOrder(order, authData);
        if (!canGetOrder) throw new AppError("Permission denied", 403);

        return order;
    }

    static async createOrder(authData: AuthData, order: NewOrder): Promise<Order> {
        const canCreateOrder = await OrderService.canCreateOrder(order, authData);
        if (!canCreateOrder) throw new AppError("Permission denied", 403);
        return await OrderService.createOrder(order);
    }

    static async cancelOrder(authData: AuthData, cancelldata: CancellOrderDto): Promise<Order> {
        return await OrderService.cancelOrder(cancelldata, authData);
    }
}
