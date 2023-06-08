import { FastifyInstance } from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { userSchema } from "../schemas/user.schema";
import { userContactCreateSchema, userContactSchema } from "../schemas/user_contact.schema";
import { NewOrder } from "../dto/new_order";
import { newOrderSchema } from "../schemas/new_order.schema";
import { OrderController } from "../controllers/orders.controller";

export const orderRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
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

    done();
};
