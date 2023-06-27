import { connect } from "mongoose";
import { FastifyFactory } from "./api/fastify/factory";
import { SL } from "./core/service_locator";
import { kMongoLink } from "./core/constants";
import { CatalogRepositoryMongoImpl } from "./data/mongo/repositories/catalog.repository";
import { VerificationCodeRepositoryMongoImpl } from "./data/mongo/repositories/verification_code.repository";
import { UsersRepositoryMongoImpl } from "./data/mongo/repositories/users.repository";
import { CompaniesRepositoryMongoImpl } from "./data/mongo/repositories/companies.repository";
import { OrdersRepositoryMongoImpl } from "./data/mongo/repositories/orders.repository";
import { PubSubRepositoryRedisImpl } from "./data/pubsub.repository";
import { CacheRepositoryRedisImpl } from "./data/cache.repository";

(async function init() {
    try {
        // Connect to MongoDB
        await connect(kMongoLink);

        // Start fastify server
        const fastify = await FastifyFactory.createInstance();
        const port = process.env.PORT || 3000;
        await fastify.listen({ port: port as number });
        console.log(`server listening on port ${port}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    SL.RegisterPubSub = new PubSubRepositoryRedisImpl();
    SL.RegisterCache = new CacheRepositoryRedisImpl();
    SL.RegisterCatalogRepository = new CatalogRepositoryMongoImpl();
    SL.RegisterVerificationCodeRepository = new VerificationCodeRepositoryMongoImpl();
    SL.RegisterUsersRepository = new UsersRepositoryMongoImpl();
    SL.RegisterCompaniesRepository = new CompaniesRepositoryMongoImpl();
    SL.RegisterOrdersRepository = new OrdersRepositoryMongoImpl();
})();
