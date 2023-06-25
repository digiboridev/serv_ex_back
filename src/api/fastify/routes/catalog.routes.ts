import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CatalogController } from "../../controllers/catalog.controller";
import { categorySchema } from "../schemas/category.schema";
import { issueSchema } from "../schemas/issue.schema";

export const catalogRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get<{ Params: { id: string } }>(
        "/category/:id",
        {
            schema: {
                params: {
                    id: { type: "string", minLength: 6 },
                },
                response: {
                    200: categorySchema,
                },
            },
        },
        async (request, reply) => {
            const result = await CatalogController.categoryById(request.params.id);
            reply.send(result);
        }
    );

    fastify.get<{ Params: { id: string } }>(
        "/category/:id/children",
        {
            schema: {
                params: {
                    id: { type: "string", minLength: 6 },
                },
                response: {
                    200: {
                        type: "array",
                        items: categorySchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await CatalogController.categories(request.params.id);
            reply.send(result);
        }
    );

    fastify.get<{ Params: { id: string } }>(
        "/category/:id/issues",
        {
            schema: {
                params: {
                    id: { type: "string", minLength: 6 },
                },
                response: {
                    200: {
                        type: "array",
                        items: issueSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await CatalogController.issuesByCategoryId(request.params.id);
            reply.send(result);
        }
    );

    fastify.get(
        "/category",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: categorySchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await CatalogController.categories();
            reply.send(result);
        }
    );

    fastify.get<{ Params: { id: string } }>(
        "/issue/:id",
        {
            schema: {
                params: {
                    id: { type: "string", minLength: 6 },
                },
                response: {
                    200: issueSchema,
                },
            },
        },
        async (request, reply) => {
            const result = await CatalogController.issueById(request.params.id);
            reply.send(result);
        }
    );

    done();
};
