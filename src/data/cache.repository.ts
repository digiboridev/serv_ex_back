import { RedisClientType, createClient } from "redis";
import { kRedisLink } from "../core/constants";
import { CacheRepository } from "../domain/repositories/cache.repository";

export class CacheRepositoryRedisImpl implements CacheRepository {
    private readonly _client: RedisClientType;
    constructor() {
        this._client = createClient({ url: kRedisLink });
        this._client.connect().catch(console.error);
    }

    public async get<T>(key: string) {
        const string = await this._client.get(key);
        if (!string) return null;
        return JSON.parse(string) as T;
    }

    public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this._client.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    }

    public async delete(key: string): Promise<void> {
        await this._client.del(key);
    }
}

export class CacheRepositoryMemoryImpl implements CacheRepository {
    private readonly _cache: Map<string, string>;
    constructor() {
        this._cache = new Map();
    }

    public async get<T>(key: string) {
        const string = this._cache.get(key);
        if (!string) return null;
        return JSON.parse(string) as T;
    }

    public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        this._cache.set(key, JSON.stringify(value));
    }

    public async delete(key: string): Promise<void> {
        this._cache.delete(key);
    }
}
