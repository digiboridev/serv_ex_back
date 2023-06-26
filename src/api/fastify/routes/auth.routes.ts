import { FastifyInstance } from "fastify";
import { AuthController } from "../../controllers/auth.controller";
import { AppError, errorMessage } from "../../../core/errors";

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
            const result = await AuthController.refreshToken(request.body.refresh_token);
            reply.send(result);
        }
    );

    fastify.post<{ Body: { code: string } }>(
        "/client/google-signin",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        code: { type: "string" },
                    },
                    required: ["code"],
                },
            },
        },
        async (request, reply) => {
            const result = await AuthController.googleSignInClient(request.body.code);
            if ("registrationToken" in result) {
                reply.send({ status: "registration_required", ...result });
            } else {
                reply.send({ status: "authorized", ...result });
            }
        }
    );


    fastify.post<{ Body: { phoneNumber: string } }>(
        "/client/phone-signin",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        phoneNumber: { type: "string", minLength: 9, maxLength: 13, pattern: "^[0-9]*$" },
                    },
                    required: ["phoneNumber"],
                },
            },
        },
        async (request, reply) => {
            const result = await AuthController.phoneSignInClient(request.body.phoneNumber);
            reply.send({ status: "code sent", token: result });
        }
    );

    fastify.post<{ Body: { code: string; token: string } }>(
        "/client/verify-code",
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
            const result = await AuthController.verifyPhoneCodeClient(request.body.token, request.body.code);
            if ("registrationToken" in result) {
                reply.send({ status: "registration_required", ...result });
            } else {
                reply.send({ status: "authorized", ...result });
            }
        }
    );

    fastify.post<{ Body: { registrationToken: string; phone: string; firstName: string; lastName: string; email: string } }>(
        "/client/register",
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
            },
        },
        async (request, reply) => {
            const data = request.body;
            const result = await AuthController.registerClient(data.registrationToken, data.phone, data.firstName, data.lastName, data.email);
            reply.send({ status: "authorized", ...result });
        }
    );

    fastify.post<{ Body: { login: string; password: string } }>(
        "/vendor/signin",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        login: { type: "string" },
                        password: { type: "string" },
                    },
                    required: ["login", "password"],
                },
            },
        },
        async (request, reply) => {
            // const result = await AuthController.vendorSignIn(request.body.login, request.body.password);
            // reply.send({ status: "authorized", ...result });
        }
    );

    done();
};
