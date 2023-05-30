import { FastifyInstance} from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
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
            try {
                const result = await UserController.getUserById(request.userId);
                if (!result) throw new ApiError("User not found", 404);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
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
            try {
                const result = await UserController.userContacts(request.userId);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
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
            try {
                const result = await UserController.updateUserContacts(request.userId, request.body);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    fastify.get<{ Querystring: { phoneOrEmail: string } }>(
        "/findByPhoneOrEmail",
        {
            schema: {
                querystring: {
                    phoneOrEmail: { type: "string" },
                },
                response: {
                    200: userSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await UserController.findUserByPhoneOrEmail(request.query.phoneOrEmail);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    done();
};
