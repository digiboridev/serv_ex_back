import { FastifyInstance } from "fastify";
import { ApiError, errorMessage } from "../utils/errors";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { CompanyController } from "../controllers/company.controller";
import { companyCreateSchema, companySchema } from "../schemas/company.schema";

export const companyRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
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
            const result = await CompanyController.getCompaniesByMemberId(request.userId);
            reply.send(result);
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
            const result = await CompanyController.createCompany(request.body.name, request.body.email, request.body.publicId, request.userId);
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
            const result = await CompanyController.updateMembers(request.body.companyId, request.body.membersIds, request.userId);
            reply.send(result);
        }
    );

    done();
};
