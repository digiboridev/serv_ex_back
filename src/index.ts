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

(async function init() {
    try {
        // Register dependencies
        SL.RegisterPubSub = new PubSubClientRedisSmartImpl();
        SL.RegisterCache = new CacheClientRedisImpl();
        SL.RegisterDLock = new DLockClientRedisImpl();
        SL.RegisterCatalogRepository = new CatalogRepositoryMongoImpl();
        SL.RegisterVerificationCodeRepository = new VerificationCodeRepositoryMongoImpl();
        SL.RegisterUsersRepository = new UsersRepositoryMongoImpl();
        SL.RegisterCompaniesRepository = new CompaniesRepositoryMongoImpl();
        SL.RegisterOrdersRepository = new OrdersRepositoryMongoImpl();

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
