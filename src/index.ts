import { connect } from "mongoose";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { companiesRoutes } from "./routes/companies.routes";
import { usersRoutes } from "./routes/users.routes";
import { catalogRoutes } from "./routes/catalog.routes";
import { ordersRoutes } from "./routes/orders.routes";
import { AppError, errorMessage } from "./utils/errors";

(async function start() {
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

    try {
        await connect("mongodb+srv://test123123:p123123@cluster0.qu7uxdd.mongodb.net/?retryWrites=true&w=majority");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        await fastify.listen({ port: 3000 });
        console.log(`server listening on port 3000`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
