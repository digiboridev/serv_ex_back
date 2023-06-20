import { connect, set } from "mongoose";
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
import { ordersUpdateService } from "./services/order.service";
import { OrderController } from "./controllers/orders.controller";

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

    fastify.get(
        "/socket",
        {
            websocket: true,
        },
        async (con, request) => {
            con.socket.send("hello new");
            con.socket.on("message", (message) => {
                console.log(message.toString());
                con.socket.send("hello");
            });
        }
    );
    fastify.get("/sse", async (req, res) => {
        // const iterable = ordersUpdateService.watchCustomerOrderChangesIterator("647f6e16f6772af65dd84321");

        // req.socket.on("close", () => iterable.return());
        // res.sse({ event: "connected" , data: JSON.stringify({})});

        // for await (const order of iterable) {
        //     console.log("sse: update");
        //     res.sse({ event: "update", data: JSON.stringify(order) });
        // }

        // const listener = ordersUpdateService.watchCustomerOrderChangesCallBack("647f6e16f6772af65dd84321", (order) => {
        //     res.sse({ event: "event.name", data: JSON.stringify(order) });
        // });
        // res.sse({ event: "connected"});
        // req.socket.on("close", () => listener.dispose());

        res.sse(
            (async function* source() {
                for (let i = 0; i < 3; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    yield { event: "update", data: JSON.stringify({ asd: "qwe", xcv: { asdasd: 12323 } }) };
                }
            })()
        );
    });

    fastify.get("/longpolling", async (req, res) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        res.send({ id: String(1), data: "Some message" });
    });

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
