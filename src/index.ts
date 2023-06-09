import { connect } from "mongoose";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { companiesRoutes } from "./routes/companies.routes";
import { usersRoutes } from "./routes/users.routes";
import { catalogRoutes } from "./routes/catalog.routes";
import { ordersRoutes } from "./routes/orders.routes";
import { ApiError, errorMessage } from "./utils/errors";

const fastify = Fastify({ logger: true });

fastify.register(cors, {});
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(userRoutes, { prefix: "/user" });
fastify.register(usersRoutes, { prefix: "/users" });
fastify.register(companiesRoutes, { prefix: "/companies" });
fastify.register(catalogRoutes, { prefix: "/catalog" });
fastify.register(ordersRoutes, { prefix: "/orders" });

fastify.addHook("onError", async (request, reply, error) => {
    console.error(error);
    if (error instanceof ApiError) {
        reply.status(error.code).send({ error: error.message });
    } else {
        reply.status(500).send({ error: errorMessage(error) });
    }
});

fastify.get("/healthcheck", (_, reply) => reply.send({ status: "ok" }));

(async function start() {
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
