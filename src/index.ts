import { connect } from "mongoose";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./auth.routes";

const fastify = Fastify({ logger: true });
fastify.register(cors, {});
fastify.register(authRoutes, { prefix: "/auth" });
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
