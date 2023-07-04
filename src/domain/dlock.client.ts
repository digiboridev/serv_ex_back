export type Lock = {
    name: string;
    release: () => Promise<unknown>;
};

export interface DLockClient {
    acquireLock(lockName: string, timeout: number): Promise<Lock>;
}
