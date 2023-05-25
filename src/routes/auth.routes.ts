import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { getErrorMessage } from "../utils/get_error_message";
import { Credentials } from "../dto/credentials";
import { credentialsSchema } from "../schemas/credentials";

export const authRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.post<{ Body: Credentials }>(
        "/password-signin",
        {
            schema: {
                body: credentialsSchema,
            },
        },
        async (request, reply) => {
            try {
                const result = await AuthController.passwordLogin(request.body);
                reply.send(result);
            } catch (error) {
                reply.status(400).send({ error: getErrorMessage(error) });
            }
        }
    );

    fastify.post<{ Body: { grant_type: string; refresh_token: string } }>(
        "/refresh-token",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        grant_type: { type: "string", const: "refresh_token" },
                        refresh_token: { type: "string" },
                    },
                    required: ["grant_type", "refresh_token"],
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await AuthController.refreshToken(request.body.refresh_token);
                reply.send(result);
            } catch (error) {
                reply.status(401).send({ error: getErrorMessage(error) });
            }
        }
    );

    done();
};
