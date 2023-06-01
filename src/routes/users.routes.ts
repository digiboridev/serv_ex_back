import { FastifyInstance } from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userSchema } from "../schemas/user.schema";
import { UsersController } from "../controllers/users.controller";

export const usersRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get<{ Params: { userId: string } }>(
        "/:userId",
        {
            schema: {
                params: {
                    userId: { type: "string", minLength: 6 },
                },
                response: {
                    200: userSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await UsersController.getUserById(request.params.userId);
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

    fastify.get<{ Params: { phoneOrEmail: string } }>(
        "/findByPhoneOrEmail/:phoneOrEmail",
        {
            schema: {
                params: {
                    phoneOrEmail: { type: "string", minLength: 3 },
                },
                response: {
                    200: userSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await UsersController.findUserByPhoneOrEmail(request.params.phoneOrEmail);
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

    done();
};
