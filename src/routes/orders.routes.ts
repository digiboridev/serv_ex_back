import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { NewOrder } from "../dto/new_order";
import { newOrderSchema } from "../schemas/new_order.schema";
import { OrderController } from "../controllers/orders.controller";
import { CustomerInfo } from "../models/order/customer_info";
import { CancellOrderDto } from "../dto/cancell_order";
import { CancellationReasons } from "../models/order/status_details/cancelled";

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

    fastify.get<{ Querystring: CustomerInfo }>(
        "/customer_orders_updates_lp",
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
            const ordersIterator = await OrderController.customerOrdersUpdates(request.authData, request.query);
            const a = await ordersIterator.next();
            ordersIterator.return();
            reply.send(a.value);
        }
    );
    fastify.get<{ Querystring: CustomerInfo }>(
        "/customer_orders_updates_sse",
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
            const ordersIterator = await OrderController.customerOrdersUpdates(request.authData, request.query);

            request.socket.on("close", () => ordersIterator.return());
            reply.sse({ event: "connected" });

            for await (const order of ordersIterator) {
                console.log("sse: update");
                reply.sse({ event: "update", data: JSON.stringify(order) });
            }
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

    fastify.post<{ Params: { orderId: string }; Body: CancellOrderDto }>(
        "/:orderId/cancell",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        orderId: { type: "string" },
                    },
                    required: ["orderId"],
                },
                body: {
                    type: "object",
                    properties: {
                        reason: { type: "string", enum: Object.values(CancellationReasons) },
                        description: { type: "string" },
                    },
                    required: ["reason", "description"],
                },
            },
        },
        async (request, reply) => {
            const order = await OrderController.cancelOrder(request.authData, {
                orderId: request.params.orderId,
                reason: request.body.reason,
                description: request.body.description,
            });
            reply.send(order);
        }
    );

    done();
};
