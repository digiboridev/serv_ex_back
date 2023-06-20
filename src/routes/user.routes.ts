import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { userSchema } from "../schemas/user.schema";
import { newUserContactSchema, userContactSchema } from "../schemas/user_contact.schema";
import { NewUserContact } from "../dto/new_user_contact";

export const userRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get(
        "/me",

        {
            schema: {
                response: {
                    200: userSchema,
                },
            },
        },
        async (request, reply) => {
            const result = await UserController.me(request.authData);
            reply.send(result);
        }
    );
    fastify.get(
        "/meTest",

        {
            websocket: true,
        },
        async (con, request) => {
            // const result = await UserController.me(request.authData);
            // reply.send(result);
            con.socket.send("hello new");
            con.socket.on("message", (message) => {
                console.log(message);
                con.socket.send("hello");
            });
        }
    );

    fastify.get(
        "/contacts",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: userContactSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await UserController.contacts(request.authData);
            reply.send(result);
        }
    );

    fastify.post<{ Body: NewUserContact[] }>(
        "/update-contacts",
        {
            schema: {
                body: {
                    type: "array",
                    items: newUserContactSchema,
                },
                response: {
                    200: {
                        type: "array",
                        items: userContactSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await UserController.updateContacts(request.authData, request.body);
            reply.send(result);
        }
    );

    done();
};
