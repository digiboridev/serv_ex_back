import { CatalogRepository } from "../domain/repositories/catalog.repository";
import { CompaniesRepository } from "../domain/repositories/companies.repository";
import { OrdersRepository } from "../domain/repositories/orders.repository";
import { UsersRepository } from "../domain/repositories/users.repository";
import { VerificationCodeRepository } from "../domain/repositories/verification_code.repository";
import { CacheClient } from "../domain/cache.client";
import { PubSubClient } from "../domain/pubsub.client";
import { DLockClient } from "../domain/dlock.client";
import { StorageClient } from "../domain/storage.client";
import { SessionsRepository } from "../domain/repositories/sessions.repository";

export class SL {
    private static _pubSub: PubSubClient;
    private static _cache: CacheClient;
    private static _dlock: DLockClient;
    private static _storage: StorageClient;
    private static _catalogRepository: CatalogRepository;
    private static _verificationCodeRepo: VerificationCodeRepository;
    private static _sessionRepository: SessionsRepository;
    private static _usersRepository: UsersRepository;
    private static _companiesRepository: CompaniesRepository;
    private static _ordersRepository: OrdersRepository;



    public static set registerPubSub(pubSub: PubSubClient) { this._pubSub = pubSub }
    public static get pubSub(): PubSubClient { return this._pubSub }

    public static set registerCache(cache: CacheClient) { this._cache = cache }
    public static get cache(): CacheClient { return this._cache }

    public static set registerDLock(dlock: DLockClient) { this._dlock = dlock }
    public static get dlock(): DLockClient { return this._dlock }

    public static set registerStorage(storage: StorageClient) { this._storage = storage }
    public static get storage(): StorageClient { return this._storage }

    public static set registerCatalogRepository(catalogRepository: CatalogRepository) { this._catalogRepository = catalogRepository }
    public static get catalogRepository(): CatalogRepository { return this._catalogRepository }

    public static set registerVerificationCodeRepository(verificationCodeRepo: VerificationCodeRepository) { this._verificationCodeRepo = verificationCodeRepo }
    public static get verificationCodeRepo(): VerificationCodeRepository { return this._verificationCodeRepo }

    public static set registerSessionRepository(sessionRepository: SessionsRepository) { this._sessionRepository = sessionRepository }
    public static get sessionRepository(): SessionsRepository { return this._sessionRepository }

    public static set registerUsersRepository(usersRepository: UsersRepository) { this._usersRepository = usersRepository }
    public static get usersRepository(): UsersRepository { return this._usersRepository }
    
    public static set registerCompaniesRepository(companiesRepository: CompaniesRepository) { this._companiesRepository = companiesRepository }
    public static get companiesRepository(): CompaniesRepository { return this._companiesRepository }
    
    public static set registerOrdersRepository(ordersRepository: OrdersRepository) { this._ordersRepository = ordersRepository }
    public static get ordersRepository(): OrdersRepository { return this._ordersRepository }
}