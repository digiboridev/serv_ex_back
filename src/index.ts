import { connect } from "mongoose";
import { createClient } from "redis";
import { FastifyFactory } from "./api/fastify/factory";
import { PubSubServiceEmitterImpl } from "./domain/services/pubsub.service";
import { SL } from "./core/service_locator";

(async function init() {
    try {
        // Connect to MongoDB
        await connect("mongodb+srv://test123123:p123123@cluster0.qu7uxdd.mongodb.net/?retryWrites=true&w=majority");

        // Connect to Redis
        const redisClient = createClient({ url: "rediss://red-cic2m2d9aq03rjkvjjq0:k0Iu1ZsDlYdsuyYYMlO3DQVRw64iIrC3@frankfurt-redis.render.com:6379" });
        await redisClient.connect();

        // Start fastify server
        const fastify = await FastifyFactory.createInstance();
        await fastify.listen({ port: 3000 });
        console.log(`server listening on port 3000`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    SL.RegisterPubSub = new PubSubServiceEmitterImpl();
})();
