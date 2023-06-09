import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { userSchema } from "../schemas/user.schema";
import { userContactCreateSchema, userContactSchema } from "../schemas/user_contact.schema";

export const userRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get(
        "/me",
        {
            schema: {
                response: {
                    200: userSchema,
                },
            },
        },
        async (request, reply) => {
            const result = await UserController.me(request.authData);
            reply.send(result);
        }
    );

    fastify.get(
        "/contacts",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: userContactSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await UserController.userContacts(request.authData);
            reply.send(result);
        }
    );

    fastify.post<{ Body: { firstName: string; lastName: string; phone: string }[] }>(
        "/update-contacts",
        {
            schema: {
                body: {
                    type: "array",
                    items: userContactCreateSchema,
                },
                response: {
                    200: {
                        type: "array",
                        items: userContactSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await UserController.updateUserContacts(request.authData, request.body);
            reply.send(result);
        }
    );

    done();
};
