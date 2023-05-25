import { FastifyRequest, FastifyReply } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { getErrorMessage } from "../utils/get_error_message";

declare module "fastify" {
    interface FastifyRequest {
        userId: string;
    }
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("authMiddleware");

    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
        reply.status(401).send({ error: "No token provided" });
        return;
    }

    try {
        const userId = AuthController.verifyAccessToken(token);
        request.userId = userId;
    } catch (error) {
        reply.status(401).send({ error: getErrorMessage(error) });
        return;
    }
};
