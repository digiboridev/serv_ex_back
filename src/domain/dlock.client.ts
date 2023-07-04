export type Lock = {
    /** The name of the lock. */
    name: string;

    /** Release the lock. */
    release: () => Promise<unknown>;
};

export interface DLockClient {
    /**
     * Acquire a lock with the given name.
     * @param lockName Typically a resource name or id.
     * @param timeout The timeout in milliseconds for the lock to be released automatically. If the lock is not released before the timeout, it will be released automatically.
     * @returns A lock object that can be used to release the lock.
     */
    acquireLock(lockName: string, timeout: number): Promise<Lock>;
}
