import fastifyWebsocket from "@fastify/websocket";
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import FastifySSEPlugin from "fastify-sse-v2";
import { AppError, errorMessage } from "../../core/errors";
import { authRoutes } from "./routes/auth.routes";
import { catalogRoutes } from "./routes/catalog.routes";
import { companiesRoutes } from "./routes/companies.routes";
import { ordersRoutes } from "./routes/orders.routes";
import { userRoutes } from "./routes/user.routes";
import { usersRoutes } from "./routes/users.routes";
import { SL } from "../../core/service_locator";
import multer from "fastify-multer";
import { File } from "fastify-multer/lib/interfaces";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { Registry, collectDefaultMetrics } from "prom-client";

export class FastifyFactory {
  static async createInstance(): Promise<FastifyInstance> {
    const fastify = Fastify();

    // Plugins
    await fastify.register(cors);
    await fastify.register(multer.contentParser);
    await fastify.register(FastifySSEPlugin);
    await fastify.register(fastifyWebsocket);

    // Routes
    await fastify.register(authRoutes, { prefix: "/auth" });
    await fastify.register(userRoutes, { prefix: "/user" });
    await fastify.register(usersRoutes, { prefix: "/users" });
    await fastify.register(companiesRoutes, { prefix: "/companies" });
    await fastify.register(catalogRoutes, { prefix: "/catalog" });
    await fastify.register(ordersRoutes, { prefix: "/orders" });

    // Error handler
    fastify.addHook("onError", async (request, reply, error) => {
      console.error(error);
      if (error instanceof AppError) {
        reply.status(error.code).send(error.message);
      } else {
        reply.status(500).send(errorMessage(error));
      }
    });

    // Prometheus metrics
    const registry = new Registry();
    collectDefaultMetrics({ register: registry });

    fastify.get("/metrics", async (_, reply) => {
      const metrics = await registry.metrics();
      reply.send(metrics);
    });

    // Debug endpoints
    fastify.get("/debug/healthcheck", (_, reply) => {
      console.log("healthcheck");
      reply.send({ status: "ok" });
    });

    fastify.get("/debug/sse", (_, res) => {
      res.sse(
        (async function* source() {
          for (let i = 0; i < 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield { id: String(i), data: "Some message" };
          }
        })()
      );
    });

    fastify.get("/debug/ws", { websocket: true }, (connection) => {
      connection.socket.on("message", (message) => {
        connection.socket.send(message.toString());
      });
    });

    fastify.post("/debug/cache", async (request, reply) => {
      const { key, value } = request.body as { key: string; value: string };
      await SL.cache.set(key, value);
      reply.send({ status: "ok" });
    });

    fastify.get("/debug/cache", async (request, reply) => {
      const { key } = request.query as { key: string };
      const value = await SL.cache.get(key);
      reply.send({ status: "ok", value });
    });

    fastify.post("/debug/file", { preHandler: multer().single("file") }, async (request, reply) => {
      console.log("debug file pre");
      const file = (request as any).file as File;
      if (!file || !file.buffer) return;
      const name: string | undefined = (request.body as any).name;

      await SL.storage.upsertBucket("files", true);
      await SL.storage.uploadFile(file.buffer, "files", name ?? file.originalname, file.mimetype);

      console.log("debug file");
      reply.send({ status: "ok" });
    });

    fastify.post("/debug/image", { preHandler: multer().single("image") }, async (request, reply) => {
      const file = (request as any).file as File | undefined;
      if (!file || !file.buffer || !file.mimetype.startsWith("image/")) throw new Error("Invalid image");

      const resized = await sharp(file.buffer).resize({ width: 500, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
      const name: string = randomUUID() + ".jpg";

      await SL.storage.upsertBucket("images", true);
      await SL.storage.uploadFile(resized, "images", name, "image/jpeg");

      console.log("debug file");
      reply.send({ status: "ok" });
    });

    fastify.get<{ Params: { filename: string } }>(
      "/debug/file/:filename",
      {
        schema: {
          params: {
            filename: { type: "string", minLength: 1 },
          },
        },
      },
      async (request, reply) => {
        const filename = request.params.filename;
        const data = await SL.storage.getFileStream("files", filename);

        reply.headers(data.headers);
        return reply.send(data.stream);
      }
    );

    return fastify;
  }
}

//aasdas
