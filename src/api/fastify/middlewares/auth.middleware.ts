import { FastifyRequest, FastifyReply } from "fastify";
import { errorMessage } from "../../../core/errors";
import { AuthData } from "../../../domain/entities/auth_data";
import { AuthService } from "../../../domain/services/auth.service";


declare module "fastify" {
    interface FastifyRequest {
        authData: AuthData;
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
        const authData = AuthService.verifyAccessToken(token);
        request.authData = authData;
        // console.log("auth middleware:", "token verified", authData);
    } catch (error) {
        reply.status(401).send(errorMessage(error));
        console.log("auth middleware:", error);
        return;
    }
};
