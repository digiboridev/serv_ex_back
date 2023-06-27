import * as dotenv from "dotenv";
dotenv.config();

export const kMongoLink = process.env.MONGOLINK!;
export const kRedisLink = process.env.REDISLINK!;
export const kGCId = process.env.GCID!;
export const kGCSecret = process.env.GCSECRET!;