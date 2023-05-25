import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getErrorMessage } from "../utils/get_error_message";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";


export const userRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/me", async (request, reply) => {
        try {
            const result = await UserService.getUserDataById(request.userId);
            reply.send(result);
        } catch (error) {
            reply.status(500).send({ error: getErrorMessage(error) });
        }
    });

    done();
};
