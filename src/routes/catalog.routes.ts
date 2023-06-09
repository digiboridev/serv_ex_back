import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CatalogController } from "../controllers/catalog.controller";
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
            const result = await CatalogController.getCategoryById(request.params.id);
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
            const result = await CatalogController.getCategories(request.params.id);
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
            const result = await CatalogController.getIssuesByCategory(request.params.id);
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
            const result = await CatalogController.getCategories();
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
            const result = await CatalogController.getIssue(request.params.id);
            reply.send(result);
        }
    );

    done();
};
