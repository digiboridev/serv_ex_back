import { FastifyInstance } from "fastify";

export const authRoutes = (fastify:FastifyInstance, _: any, done:Function) => {
    fastify.post(
        "/",
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
            reply.send({ hello: "world" });
        }
    );

    done();
};
