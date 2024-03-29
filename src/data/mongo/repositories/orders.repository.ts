import { AppError } from "../../../core/errors";
import { NewOrder } from "../../../domain/dto/new_order";
import { Order } from "../../../domain/entities/order/order";
import { OrdersRepository } from "../../../domain/repositories/orders.repository";
import { OrderModel } from "../models/order/order";

export class OrdersRepositoryMongoImpl implements OrdersRepository {
    async createOrder(order: NewOrder): Promise<Order> {
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

    async orders(customerId?: string): Promise<Order[]> {
        const query = customerId ? { "customerInfo.customerId": customerId } : {};
        const orders = await OrderModel.find(query).sort({ createdAt: -1 });
        return orders.map((order) => order.toObject());
    }

    async orderById(orderId: string): Promise<Order> {
        const order = await OrderModel.findById(orderId);
        if (!order) throw new AppError("Order not found", 404);
        return order.toObject();
    }

    async updateOrder(orderId: string, order: Order): Promise<Order> {
        const updatedOrder = await OrderModel.findById(orderId);
        if (!updatedOrder) throw new AppError("Order not found", 404);

        updatedOrder.set(order);
        await updatedOrder.save();

        return updatedOrder.toObject();
    }
}
