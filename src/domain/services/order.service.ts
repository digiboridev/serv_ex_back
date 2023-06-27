import { CancellOrderDto } from "../dto/cancell_order";
import { NewOrder } from "../dto/new_order";
import { AuthData } from "../entities/auth_data";
import { AppError } from "../../core/errors";
import { CompanyService } from "./company.service";
import { SL } from "../../core/service_locator";
import { OrderModel } from "../../data/mongo/models/order/order";
import { CustomerInfo } from "../entities/order/customer_info";
import { Order } from "../entities/order/order";
import { OrderStatusType } from "../entities/order/order_status";

export class OrderService {
    /**
     * Cancel order
     * @param cancelldata - cancellation data
     * @param authData - auth data of user who is cancelling order
     * @returns Cancelled order
     */
    static async cancelOrder(cancelldata: CancellOrderDto, authData: AuthData): Promise<Order> {
        const order = await SL.ordersRepository.orderById(cancelldata.orderId);

        const hasAccess = await OrderService.hasAccessToResource(authData, order.customerInfo);
        if (!hasAccess) throw new AppError("Permission denied", 403);

        // if order is already canceled, return it
        if (order.status.currentStatus == OrderStatusType.canceled) return order;

        if (authData.scope == "customer") {
            order.status.currentStatus = OrderStatusType.canceled;
            order.status.cancellDetails = {
                reason: cancelldata.reason,
                description: cancelldata.description,
                actor: "customer",
            };
        } else {
            order.status.currentStatus = OrderStatusType.canceled;
            order.status.cancellDetails = {
                reason: cancelldata.reason,
                description: cancelldata.description,
                actor: "employee",
                employeeId: authData.entityId,
            };
        }

        return SL.ordersRepository.updateOrder(order.id, order);
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
}
