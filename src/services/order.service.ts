import { NewOrder } from "../dto/new_order";
import { CustomerInfo } from "../models/order/customer_info";
import { Order, OrderModel } from "../models/order/order";

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

    static async getCustomerOrders(customerId: string): Promise<Order[]> {
        const orders = await OrderModel.find({ "customerInfo.customerId": customerId });
        return orders.map((order) => order.toObject());
    }

    static async getOrderById(orderId: string): Promise<Order | null> {
        const order = await OrderModel.findById(orderId);
        return order?.toObject() ?? null;
    }
}
