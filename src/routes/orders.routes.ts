import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { NewOrder } from "../dto/new_order";
import { newOrderSchema } from "../schemas/new_order.schema";
import { OrderController } from "../controllers/orders.controller";
import { CustomerInfo } from "../models/order/customer_info";

export const ordersRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get<{ Querystring?: CustomerInfo }>(
        "/",
        {
            schema: {
                querystring: {
                    oneOf: [
                        {
                            type: "object",
                            properties: {
                                customerId: { type: "null" },
                                customerType: { type: "null" },
                            },
                        },
                        {
                            type: "object",
                            properties: {
                                customerType: { type: "string", enum: ["personal", "company"] },
                                customerId: { type: "string" },
                            },
                            required: ["customerType", "customerId"],
                        },
                    ],
                },
            },
        },
        async (request, reply) => {
            const orders = await OrderController.orders(request.authData, request.query);
            reply.send(orders);
        }
    );

    fastify.get<{ Params: { orderId: string } }>(
        "/:orderId",
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
            const order = await OrderController.orderById(request.authData, request.params.orderId);
            reply.send(order);
        }
    );

    fastify.post<{ Body: NewOrder }>(
        "/",
        {
            schema: {
                body: newOrderSchema,
            },
        },
        async (request, reply) => {
            const order = await OrderController.createOrder(request.authData, request.body);
            reply.send(order);
        }
    );

    done();
};
