import { connect } from "mongoose";
import { RedisModules, createClient } from "redis";
import { FastifyFactory } from "./api/fastify/factory";
import { PubSubServiceEmitterImpl, PubSubServiceRedisImpl } from "./domain/services/pubsub.service";
import { SL } from "./core/service_locator";
import { kMongoLink, kRedisLink } from "./core/constants";
import { CacheService, CacheServiceRedisImpl } from "./domain/services/cache.service";

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
