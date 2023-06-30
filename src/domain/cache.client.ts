export interface CacheClient {
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
