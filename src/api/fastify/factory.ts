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
import { SL } from "../../core/service_locator";

export class FastifyFactory {
    static async createInstance(): Promise<FastifyInstance> {
        const fastify = Fastify();
        await fastify.register(cors, {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        });
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

        fastify.get("/debug/healthcheck", (_, reply) => {
            console.log("healthcheck");
            reply.send({ status: "ok" });
        });

        fastify.get("/debug/sse", (_, res) => {
            res.sse(
                (async function* source() {
                    for (let i = 0; i < 10; i++) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        yield { id: String(i), data: "Some message" };
                    }
                })()
            );
        });

        fastify.get("/debug/ws", { websocket: true }, (connection) => {
            connection.socket.on("message", (message) => {
                connection.socket.send(message.toString());
            });
        });

        fastify.post("/debug/cache", async (request, reply) => {
            const { key, value } = request.body as { key: string; value: string };
            await SL.cache.set(key, value);
            reply.send({ status: "ok" });
        });

        fastify.get("/debug/cache", async (request, reply) => {
            const { key } = request.query as { key: string };
            const value = await SL.cache.get(key);
            reply.send({ status: "ok", value });
        });

        return fastify;
    }
}
