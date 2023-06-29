import { WrappedBalancer } from "queueable";
import { NewOrder } from "../dto/new_order";
import { Order } from "../entities/order/order";

export interface OrdersRepository {
    /**
     * Create new order
     * @param order - dto with order data
     * @returns Newly created order
     */
    createOrder(order: NewOrder): Promise<Order>;

    /** Get orders for specific customer or for all customers if customerId is not provided */
    orders(customerId?: string): Promise<Order[]>;

    /** Get order by id */
    orderById(orderId: string): Promise<Order>;
    /** Update order */
    updateOrder(orderId: string, order: Order): Promise<Order>;
}
