import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { ApiError, errorMessage } from "../utils/errors";

export const authRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
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
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    fastify.post<{ Body: { phoneNumber: string } }>(
        "/phone-signin",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        phoneNumber: { type: "string", minLength: 10, maxLength: 14, pattern: "^[0-9]*$" },
                    },
                    required: ["phoneNumber"],
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await AuthController.phoneSignIn(request.body.phoneNumber);
                reply.send({ status: "code sent", token: result });
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    fastify.post<{ Body: { code: string; token: string } }>(
        "/verify-code",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        code: { type: "string", minLength: 4, maxLength: 4, pattern: "^[0-9]*$" },
                        token: { type: "string", minLength: 10 },
                    },
                    required: ["code", "token"],
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await AuthController.verifyCode(request.body.token, request.body.code);
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
