import * as dotenv from "dotenv";
dotenv.config();

export const kMongoLink = process.env.MONGOLINK!;
export const kRedisLink = process.env.REDISLINK!;
export const kGCId = process.env.GCID!;
export const kGCSecret = process.env.GCSECRET!;
export const kDomain = process.env.DOMAIN!;
export const kStorageDomain = process.env.STORAGEDOMAIN!;
export const kMinioEnd = process.env.STORAGEADDR!;
export const kMinioPort = process.env.STORAGEPORT!;
export const kMinioAcc = process.env.STORAGEACC!;
export const kMinioPwd = process.env.STORAGEPWD!;