import * as dotenv from "dotenv";
dotenv.config();

export const kMongoLink = process.env.MONGOLINK!;
export const kRedisLink = process.env.REDISLINK!;
export const kGCId = process.env.GCID!;
export const kGCSecret = process.env.GCSECRET!;
export const kDomain = process.env.DOMAIN!;
export const kStorageDomain = process.env.STORAGEDOMAIN!;
export const kStorageAddr = process.env.STORAGEADDR!;
export const kStoragePort = process.env.STORAGEPORT!;
export const kStorageAcc = process.env.STORAGEACC!;
export const kStoragePwd = process.env.STORAGEPWD!;