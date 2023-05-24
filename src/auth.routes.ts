import { FastifyInstance } from "fastify";
import { UserService } from "./services/user.service";
import { User, UserCredentials } from "./models/user";
import { Jwt, sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { SessionModel } from "./models/session";
import { SessionService } from "./services/session.service";

const credentialsSchema = {
    type: "object",
    properties: {
        email: { type: "string", minLength: 3, maxLength: 20 },
        phone: { type: "string", minLength: 3, maxLength: 20 },
        password: { type: "string", minLength: 3, maxLength: 20 },
    },
    oneOf: [{ required: ["email"] }, { required: ["phone"] }],
    required: ["password"],
};

export type Credentials = {
    email?: string;
    phone?: string;
    password: string;
};

export const authRoutes = (fastify: FastifyInstance, _: any, done: Function) => {
    fastify.post<{ Body: Credentials }>(
        "/password-signin",
        {
            schema: {
                body: credentialsSchema,
            },
        },
        async (request, reply) => {
            const { email, phone, password } = request.body;
            console.log("password-signin: ", email, phone, password);

            let user: UserCredentials | null = null;
            if (email) user = await UserService.getUserCredentialsByEmail(email);
            if (phone) user = await UserService.getUserCredentialsByPhone(phone);

            if (!user) {
                reply.status(400).send({ error: "No user found" });
                console.log("No user found");
                return;
            }

            if (user.password !== password) {
                reply.status(400).send({ error: "Wrong password" });
                console.log("Wrong password");
                return;
            }

            const session = await SessionService.createSession(user.id);
            const refreshToken = sign({ sessionId: session.id }, "refresh_token_secret", { expiresIn: "1y" });
            const accessToken = sign({ userId: user.id }, "access_token_secret", { expiresIn: "15m" });
            reply.send({ refreshToken, accessToken });
        }
    );

    done();
};
