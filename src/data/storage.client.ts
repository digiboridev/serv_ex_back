import { Client } from "minio";
import { kStorageAcc, kStorageAddr, kStoragePort, kStoragePwd, kStorageDomain } from "../core/constants";
import { AppError } from "../core/errors";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { StorageClient } from "../domain/storage.client";

export class StorageClientMinioImpl implements StorageClient {
    private _client: Client;
    constructor() {
        this._client = new Client({
            endPoint: kStorageAddr,
            port: +kStoragePort,
            accessKey: kStorageAcc,
            secretKey: kStoragePwd,
            useSSL: false,
        });
    }

    async upsertBucket(bucket: string, grantPublicRead?: boolean): Promise<void> {
        const bucketExists = await this._client.bucketExists(bucket);
        if (!bucketExists) await this._client.makeBucket(bucket, "us-east-1");
        if (!bucketExists && grantPublicRead) {
            this._client.setBucketPolicy(
                bucket,
                JSON.stringify({
                    Version: "2012-10-17",
                    Statement: [{ Sid: "", Effect: "Allow", Principal: "*", Action: ["s3:GetObject"], Resource: [`arn:aws:s3:::${bucket}/*`] }],
                })
            );
        }
    }

    async uploadFile(data: Buffer | Readable, bucket: string, path: string, mimetype?: string): Promise<string> {
        await this._client.putObject(bucket, path, data, { "Content-Type": mimetype ?? "application/octet-stream" });
        return kStorageDomain + "/" + bucket + "/" + path;
    }

    async getFileBuffer(bucket: string, path: string): Promise<{ headers: { [key: string]: any }; buffer: Buffer }> {
        const data = await this._client.getObject(bucket, path);
        if (!data) throw new AppError("File not found", 404);

        const dataHeaders = (data as IncomingMessage).headers;

        const buffer: Buffer[] = [];
        for await (const chunk of data) {
            buffer.push(chunk);
        }

        return { headers: dataHeaders, buffer: Buffer.concat(buffer) };
    }

    async getFileStream(bucket: string, path: string): Promise<{ headers: { [key: string]: any }; stream: Readable }> {
        const data = await this._client.getObject(bucket, path);
        if (!data) throw new AppError("File not found", 404);

        const dataHeaders = (data as IncomingMessage).headers;

        return { headers: dataHeaders, stream: data };
    }
}
