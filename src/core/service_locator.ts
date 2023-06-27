import { User } from "../domain/entities/user";
import { CatalogRepository } from "../domain/repositories/catalog.repository";
import { CompaniesRepository } from "../domain/repositories/companies.repository";
import { OrdersRepository } from "../domain/repositories/orders.repository";
import { UsersRepository } from "../domain/repositories/users.repository";
import { VerificationCodeRepository } from "../domain/repositories/verification_code.repository";
import { CacheRepository } from "../domain/repositories/cache.repository";
import { PubSubRepository } from "../domain/repositories/pubsub.repository";

export class SL {
    private static _pubSub: PubSubRepository;
    private static _cache: CacheRepository;
    private static _catalogRepository: CatalogRepository;
    private static _verificationCodeRepo: VerificationCodeRepository;
    private static _usersRepository: UsersRepository;
    private static _companiesRepository: CompaniesRepository;
    private static _ordersRepository: OrdersRepository;


    public static set RegisterPubSub(pubSub: PubSubRepository) {
        this._pubSub = pubSub;
    }

    public static get pubSub(): PubSubRepository {
        return this._pubSub;
    }

    public static set RegisterCache(cache: CacheRepository) {
        this._cache = cache;
    }

    public static get cache(): CacheRepository {
        return this._cache;
    }

    public static set RegisterCatalogRepository(catalogRepository: CatalogRepository) {
        this._catalogRepository = catalogRepository;
    }

    public static get catalogRepository(): CatalogRepository {
        return this._catalogRepository;
    }

    public static set RegisterVerificationCodeRepository(verificationCodeRepo: VerificationCodeRepository) {
        this._verificationCodeRepo = verificationCodeRepo;
    }

    public static get verificationCodeRepo(): VerificationCodeRepository {
        return this._verificationCodeRepo;
    }

    public static set RegisterUsersRepository(usersRepository: UsersRepository) {
        this._usersRepository = usersRepository;
    }

    public static get usersRepository(): UsersRepository {
        return this._usersRepository;
    }
    
    public static set RegisterCompaniesRepository(companiesRepository: CompaniesRepository) {
        this._companiesRepository = companiesRepository;
    }

    public static get companiesRepository(): CompaniesRepository {
        return this._companiesRepository;
    }
    
    public static set RegisterOrdersRepository(ordersRepository: OrdersRepository) {
        this._ordersRepository = ordersRepository;
    }

    public static get ordersRepository(): OrdersRepository {
        return this._ordersRepository;
    }
}