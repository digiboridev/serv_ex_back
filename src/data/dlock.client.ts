import Redis from "ioredis";
import { kRedisLink } from "../core/constants";
import Redlock from "redlock";
import { DLockClient, Lock } from "../domain/dlock.client";

export class DLockClientRedisImpl implements DLockClient {
    private readonly redlock: Redlock;
    constructor() {
        const redisC = new Redis(kRedisLink);
        this.redlock = new Redlock([redisC], { driftFactor: 0.01, retryCount: -1, retryDelay: 200, retryJitter: 200, automaticExtensionThreshold: 500 });
    }

    async acquireLock(lockName: string, timeout: number): Promise<Lock> {
        const lock = await this.redlock.acquire([lockName], timeout);
        return {
            name: lockName,
            release: () => lock.release(),
        };
    }
}

export class DLockClientMemoryImpl implements DLockClient {
    private readonly locks: Map<string, Lock> = new Map();

    async acquireLock(lockName: string, timeout: number): Promise<Lock> {
        while (this.locks.has(lockName)) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const lock: Lock = {
            name: lockName,
            release: () => {
                this.locks.delete(lockName);
                return Promise.resolve();
            },
        };

        this.locks.set(lockName, lock);

        setTimeout(() => lock.release(), timeout);

        return lock;
    }
}
