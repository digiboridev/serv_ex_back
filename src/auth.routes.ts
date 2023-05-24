import { FastifyInstance } from "fastify";
import { AuthController } from "./controllers/auth.controller";
import { getErrorMessage } from "./utils/get_error_message";
import { Credentials } from "./dto/credentials";
import { credentialsSchema } from "./schemas/credentials";

const midd1 = async (request: any, reply: any) => {
    console.log("midd1");
    reply.status(400).send({ error: "prost" });
};

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

    fastify.post<{ Body: { refreshToken: string } }>(
        "/refresh-token",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        refreshToken: { type: "string" },
                    },

                    required: ["refreshToken"],
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await AuthController.refreshToken(request.body.refreshToken);
                reply.send(result);
            } catch (error) {
                reply.status(401).send({ error: getErrorMessage(error) });
            }
        }
    );

    done();
};
