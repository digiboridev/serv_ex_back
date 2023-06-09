import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CompaniesController } from "../controllers/companies.controller";
import { companyCreateSchema, companySchema } from "../schemas/company.schema";

export const companiesRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get(
        "/user-companies",
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
            const result = await CompaniesController.getUserCompanies(request.authData);
            reply.send(result);
        }
    );

    fastify.post<{ Body: { name: string; email: string; publicId: string; membersIds: string[] } }>(
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
            const result = await CompaniesController.createCompany(
                request.body.name,
                request.body.email,
                request.body.publicId,
                request.body.membersIds,
                request.authData
            );
            reply.send(result);
        }
    );

    fastify.post<{ Body: { companyId: string; membersIds: string[] } }>(
        "/update-members",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["companyId", "membersIds"],
                    properties: {
                        companyId: { type: "string" },
                        membersIds: { type: "array", items: { type: "string" } },
                    },
                },
                response: {
                    200: companySchema,
                },
            },
        },
        async (request, reply) => {
            const result = await CompaniesController.updateMembers(request.body.companyId, request.body.membersIds, request.authData);
            reply.send(result);
        }
    );

    done();
};
