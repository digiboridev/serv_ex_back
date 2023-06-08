import { NewOrder } from "../dto/new_order";
import { Order } from "../models/order/order";
import { CompanyService } from "../services/company.service";
import { OrderService } from "../services/order.service";
import { ApiError } from "../utils/errors";

export class OrderController {
    static async createOrder(userId: string, order: NewOrder): Promise<Order> {
        if (order.customerInfo.customerType === "company") {
            const company = await CompanyService.getCompanyById(order.customerInfo.customerId);
            if (!company) {
                throw new ApiError("Company not found", 404);
            }
            if (!company.membersIds.includes(userId)) {
                throw new ApiError(`You are not a member of company ${company.name}`, 403);
            }
        }

        if (order.customerInfo.customerType === "personal" && order.customerInfo.customerId !== userId) {
            throw new ApiError("You can not create order for another person", 403);
        }
        
        return await OrderService.createOrder(order);
    }
}
