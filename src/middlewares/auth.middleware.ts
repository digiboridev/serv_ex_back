import { FastifyRequest, FastifyReply } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { errorMessage } from "../utils/errors";

declare module "fastify" {
    interface FastifyRequest {
        userId: string;
    }
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
        reply.status(401).send("No token provided");
        console.log("auth middleware:", "no token provided");
        return;
    }

    try {
        const userId = AuthController.verifyAccessToken(token);
        request.userId = userId;
        console.log("auth middleware:", "token verified", userId);
    } catch (error) {
        reply.status(401).send(errorMessage(error));
        console.log("auth middleware:", error);
        return;
    }
};
