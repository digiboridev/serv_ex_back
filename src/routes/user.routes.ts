import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";


export const userRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/me", async (request, reply) => {
        try {
            const result = await UserService.getUserDataById(request.userId);
            reply.send(result);
        } catch (error) {
            if (error instanceof ApiError) {
                reply.status(error.code).send({ error: error.message });
            } else {
                reply.status(500).send({ error: errorMessage(error) });
            }
        }
    });

    done();
};
