import { FastifyInstance} from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userSchema } from "../schemas/user.schema";
import { UsersController } from "../controllers/users.controller";

export const usersRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get<{ Querystring: { userId: string },Params:{} }>(
        "/findById",
        {
            schema: {
                querystring: {
                    userId: { type: "string" },
                },
                response: {
                    200: userSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await UsersController.getUserById(request.query.userId);
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
                const result = await UsersController.findUserByPhoneOrEmail(request.query.phoneOrEmail);
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
