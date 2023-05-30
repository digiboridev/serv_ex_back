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
                response: {
                    200: {
                        type: "object",
                        properties: {
                            userId: { type: "string" },
                            refreshToken: { type: "string" },
                            accessToken: { type: "string" },
                        },
                    },
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
                        phoneNumber: { type: "string", minLength: 9, maxLength: 13, pattern: "^[0-9]*$" },
                    },
                    required: ["phoneNumber"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string" },
                            token: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                // reply.status(400).send('fuck uo');
                const result = await AuthController.phoneSignIn(request.body.phoneNumber);
                reply.send({ status: "code sent", token: result });
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send(error.message);
                } else {
                    reply.status(500).send(errorMessage(error));
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
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string" },
                            userId: { type: "string" },
                            refreshToken: { type: "string" },
                            accessToken: { type: "string" },
                            registrationToken: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await AuthController.verifyCode(request.body.token, request.body.code);
                if ("registrationToken" in result) {
                    reply.send({ status: "registration_required", ...result });
                } else {
                    reply.send({ status: "authorized", ...result });
                }
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    fastify.post<{ Body: { registrationToken: string; phone: string; firstName: string; lastName: string; email: string } }>(
        "/register",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        registrationToken: { type: "string" },
                        phone: { type: "string", minLength: 9, maxLength: 13, pattern: "^[0-9]*$" },
                        firstName: { type: "string", minLength: 2, maxLength: 10 },
                        lastName: { type: "string", minLength: 2, maxLength: 10 },
                        email: { type: "string", format: "email" },
                    },
                    required: ["registrationToken", "phone", "firstName", "lastName", "email"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string" },
                            userId: { type: "string" },
                            refreshToken: { type: "string" },
                            accessToken: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const data = request.body;
                const result = await AuthController.register(data.registrationToken, data.phone, data.firstName, data.lastName, data.email);
                reply.send({ status: "authorized", ...result });
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
