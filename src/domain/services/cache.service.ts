import { RedisClientType, createClient } from "redis";
import { kRedisLink } from "../../core/constants";

export interface CacheService {
    /**
     * Get a value from cache
     * @param key string
     * @returns null if key does not exist
     *
     */
    get<T extends Object>(key: string): Promise<T | null>;

    /**
     * Set a key value pair in cache
     * @param key string
     * @param value must be JSON serializable object
     * @param ttl time to live in seconds
     */
    set<T extends Object>(key: string, value: T, ttl?: number): Promise<void>;

    /**
     * Delete a key from cache
     * @param key string
     */
    delete(key: string): Promise<void>;
}

export class CacheServiceRedisImpl implements CacheService {
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

export class CacheServiceMemoryImpl implements CacheService {
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
