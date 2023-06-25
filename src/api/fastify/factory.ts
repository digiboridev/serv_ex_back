import fastifyWebsocket from "@fastify/websocket";
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import FastifySSEPlugin from "fastify-sse-v2";
import { AppError, errorMessage } from "../../core/errors";
import { authRoutes } from "./routes/auth.routes";
import { catalogRoutes } from "./routes/catalog.routes";
import { companiesRoutes } from "./routes/companies.routes";
import { ordersRoutes } from "./routes/orders.routes";
import { userRoutes } from "./routes/user.routes";
import { usersRoutes } from "./routes/users.routes";

export class FastifyFactory {
    static async createInstance(): Promise<FastifyInstance> {
        const fastify = Fastify();
        await fastify.register(cors, {});
        await fastify.register(FastifySSEPlugin);
        await fastify.register(fastifyWebsocket);
        await fastify.register(authRoutes, { prefix: "/auth" });
        await fastify.register(userRoutes, { prefix: "/user" });
        await fastify.register(usersRoutes, { prefix: "/users" });
        await fastify.register(companiesRoutes, { prefix: "/companies" });
        await fastify.register(catalogRoutes, { prefix: "/catalog" });
        await fastify.register(ordersRoutes, { prefix: "/orders" });

        fastify.addHook("onError", async (request, reply, error) => {
            console.error(error);
            if (error instanceof AppError) {
                reply.status(error.code).send(error.message);
            } else {
                reply.status(500).send(errorMessage(error));
            }
        });

        fastify.get("/healthcheck", (_, reply) => reply.send({ status: "ok" }));
        return fastify;
    }
}
