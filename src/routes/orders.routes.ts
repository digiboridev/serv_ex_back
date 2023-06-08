import { FastifyInstance } from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { userSchema } from "../schemas/user.schema";
import { userContactCreateSchema, userContactSchema } from "../schemas/user_contact.schema";
import { NewOrder } from "../dto/new_order";
import { newOrderSchema } from "../schemas/new_order.schema";
import { OrderController } from "../controllers/orders.controller";
import { CustomerInfo } from "../models/order/customer_info";

export const ordersRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.post<{ Body: NewOrder }>(
        "/create-order",
        {
            schema: {
                body: newOrderSchema,
            },
        },
        async (request, reply) => {
            const order = await OrderController.createOrder(request.userId, request.body);
            reply.send(order);
        }
    );

    fastify.get<{ Querystring: CustomerInfo }>(
        "/customer-orders",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        customerType: { type: "string", enum: ["personal", "company"] },
                        customerId: { type: "string" },
                    },
                    required: ["customerType", "customerId"],
                },
            },
        },
        async (request, reply) => {
            const orders = await OrderController.getCustomerOrders(request.userId, request.query);
            reply.send(orders);
        }
    );

    fastify.get<{ Params: { orderId: string } }>(
        "/customer-orders/:orderId",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        orderId: { type: "string" },
                    },
                    required: ["orderId"],
                },
            },
        },
        async (request, reply) => {
            const order = await OrderController.getOrderById(request.userId, request.params.orderId);
            reply.send(order);
        }
    );

    done();
};
