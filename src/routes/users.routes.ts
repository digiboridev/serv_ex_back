import { FastifyInstance } from "fastify";
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
            const result = await UsersController.getUserById(request.params.userId);
            reply.send(result);
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
            const result = await UsersController.findUserByPhoneOrEmail(request.params.phoneOrEmail);
            reply.send(result);
        }
    );

    fastify.get<{ Params: { query: string } }>(
        "/search/:query",
        {
            schema: {
                params: {
                    query: { type: "string", minLength: 3 },
                },
                response: {
                    200: {
                        type: "array",
                        items: userSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await UsersController.searchUsers(request.params.query);
            reply.send(result);
        }
    );

    done();
};
