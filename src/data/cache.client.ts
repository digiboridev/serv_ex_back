import { kRedisLink } from "../core/constants";
import { CacheClient } from "../domain/cache.client";
import { Redis } from "ioredis";

export class CacheClientRedisImpl implements CacheClient {
    private readonly _client: Redis;
    constructor() {
        this._client = new Redis(kRedisLink);
    }

    public async get<T>(key: string) {
        const string = await this._client.get(key);
        if (!string) return null;
        return JSON.parse(string) as T;
    }

    public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this._client.set(key, JSON.stringify(value));
        if (ttl) this._client.expire(key, ttl);
    }

    public async delete(key: string): Promise<void> {
        await this._client.del(key);
    }
}

export class CacheRepositoryMemoryImpl implements CacheClient {
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
