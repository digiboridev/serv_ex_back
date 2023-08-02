import { connect } from "mongoose";
import { FastifyFactory } from "./api/fastify/factory";
import { SL } from "./core/service_locator";
import { kMongoLink } from "./core/constants";
import { CatalogRepositoryMongoImpl } from "./data/mongo/repositories/catalog.repository";
import { VerificationCodeRepositoryMongoImpl } from "./data/mongo/repositories/verification_code.repository";
import { UsersRepositoryMongoImpl } from "./data/mongo/repositories/users.repository";
import { CompaniesRepositoryMongoImpl } from "./data/mongo/repositories/companies.repository";
import { OrdersRepositoryMongoImpl } from "./data/mongo/repositories/orders.repository";
import { PubSubClientRedisSmartImpl } from "./data/pubsub.client";
import { CacheClientRedisImpl } from "./data/cache.client";
import { DLockClientRedisImpl } from "./data/dlock.client";
import { StorageClientMinioImpl } from "./data/storage.client";

(async function init() {
    try {
        // Register dependencies
        SL.registerPubSub = new PubSubClientRedisSmartImpl();
        SL.registerCache = new CacheClientRedisImpl();
        SL.registerDLock = new DLockClientRedisImpl();
        SL.registerCatalogRepository = new CatalogRepositoryMongoImpl();
        SL.registerVerificationCodeRepository = new VerificationCodeRepositoryMongoImpl();
        SL.registerUsersRepository = new UsersRepositoryMongoImpl();
        SL.registerCompaniesRepository = new CompaniesRepositoryMongoImpl();
        SL.registerOrdersRepository = new OrdersRepositoryMongoImpl();
        SL.registerStorage = new StorageClientMinioImpl();
        
        // Connect to MongoDB
        await connect(kMongoLink);

        // Start fastify server
        const fastify = await FastifyFactory.createInstance();
        const port = (process.env.PORT || 3000) as number;
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`server listening on port ${port}`);

        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

