import { connect } from "mongoose";
import { FastifyFactory } from "./api/fastify/factory";
import { PubSubServiceRedisImpl } from "./domain/services/pubsub.service";
import { SL } from "./core/service_locator";
import { CacheServiceRedisImpl } from "./domain/services/cache.service";
import { kMongoLink } from "./core/constants";

(async function init() {
    try {
        // Connect to MongoDB
        await connect(kMongoLink);

        // Start fastify server
        const fastify = await FastifyFactory.createInstance();
        await fastify.listen({ port: 3000 });
        console.log(`server listening on port 3000`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    SL.RegisterPubSub = new PubSubServiceRedisImpl();
    SL.RegisterCache = new CacheServiceRedisImpl();
})();
