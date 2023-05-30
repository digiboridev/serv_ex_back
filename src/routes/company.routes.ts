import { FastifyInstance } from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { CompanyController } from "../controllers/company.controller";
import { companyCreateSchema, companySchema } from "../schemas/company.schema";

export const companyRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get(
        "/companies",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: companySchema,
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await CompanyController.getCompaniesByMemberId(request.userId);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    fastify.post<{ Body: { name: string; email: string; publicId: string } }>(
        "/create-company",
        {
            schema: {
                body: companyCreateSchema,
                response: {
                    200: companySchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await CompanyController.createCompany(request.body.name, request.body.email, request.body.publicId, request.userId);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    fastify.post<{ Body: { companyId: string; members: string[] } }>(
        "/update-members",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["companyId", "members"],
                    properties: {
                        companyId: { type: "string" },
                        members: { type: "array", items: { type: "string" } },
                    },
                },
                response: {
                    200: companySchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const result = await CompanyController.updateMembers(request.body.companyId, request.body.members, request.userId);
                reply.send(result);
            } catch (error) {
                if (error instanceof ApiError) {
                    reply.status(error.code).send({ error: error.message });
                } else {
                    reply.status(500).send({ error: errorMessage(error) });
                }
            }
        }
    );

    done();
};
