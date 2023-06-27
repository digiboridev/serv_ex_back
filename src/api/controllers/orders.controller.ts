import { CancellOrderDto } from "../../domain/dto/cancell_order";
import { NewOrder } from "../../domain/dto/new_order";
import { AuthData } from "../../domain/entities/auth_data";
import { OrderService } from "../../domain/services/order.service";
import { AppError } from "../../core/errors";
import { CustomerInfo } from "../../domain/entities/order/customer_info";
import { Order } from "../../domain/entities/order/order";
import { SL } from "../../core/service_locator";

export class OrderController {
    static async orders(authData: AuthData, customerInfo?: CustomerInfo): Promise<Order[]> {
        // If customerInfo is specified get orders for that customer
        if (customerInfo) {
            // Check if user has access to that resource
            const hasAccess = await OrderService.hasAccessToResource(authData, customerInfo);
            if (!hasAccess) throw new AppError("Permission denied", 403);
            return await SL.ordersRepository.orders(customerInfo.customerId);
        }

        // If customerInfo is not specified get all orders for vendor or client orders for client
        if (authData.scope === "customer") {
            return await SL.ordersRepository.orders(authData.entityId);
        } else {
            return await SL.ordersRepository.orders();
        }
    }

    static async ordersUpdates(authData: AuthData, customerInfo?: CustomerInfo) {
        // If customerInfo is specified get orders for that customer
        if (customerInfo) {
            // Check if user has access to that resource
            const hasAccess = await OrderService.hasAccessToResource(authData, customerInfo);
            if (!hasAccess) throw new AppError("Permission denied", 403);
            return SL.ordersRepository.watchOrdersUpdates(customerInfo.customerId);
        }

        // If customerInfo is not specified get all orders for vendor or client orders for client
        if (authData.scope === "customer") {
            return SL.ordersRepository.watchOrdersUpdates(authData.entityId);
        } else {
            return SL.ordersRepository.watchOrdersUpdates();
        }
    }

    static async order(authData: AuthData, orderId: string): Promise<Order> {
        const order = await SL.ordersRepository.orderById(orderId);
        const canGetOrder = await OrderService.canGetOrder(order, authData);
        if (!canGetOrder) throw new AppError("Permission denied", 403);

        return order;
    }

    static async orderUpdates(authData: AuthData, orderId: string) {
        const order = await SL.ordersRepository.orderById(orderId);
        const canGetOrder = await OrderService.canGetOrder(order, authData);
        if (!canGetOrder) throw new AppError("Permission denied", 403);

        return SL.ordersRepository.watchOrderUpdates(orderId);
    }

    static async createOrder(authData: AuthData, order: NewOrder): Promise<Order> {
        const canCreateOrder = await OrderService.canCreateOrder(order, authData);
        if (!canCreateOrder) throw new AppError("Permission denied", 403);
        return await SL.ordersRepository.createOrder(order);
    }

    static async cancelOrder(authData: AuthData, cancelldata: CancellOrderDto): Promise<Order> {
        return await OrderService.cancelOrder(cancelldata, authData);
    }
}
