import { Readable } from "stream";

export interface StorageClient {
    /**
     * Creates a bucket if it doesn't exist
     * @param bucket The bucket name
     * @param grantPublicRead If true, grant everyone access to get files from the bucket directly
     */
    upsertBucket(bucket: string, grantPublicRead: boolean): Promise<void>;

    /**
     * Uploads a file to the storage service
     * @param buffer The file buffer
     * @param bucket The bucket name
     * @param path The path to the file including the file name
     * @param mimetype The file mimetype
     * @returns global url to the file
     */
    uploadFile(data: Buffer | Readable, bucket: string, path: string, mimetype?: string): Promise<string>;

    /**
     * Downloads a file from the storage service
     * @param bucket The bucket name
     * @param path The path to the file including the file name
     * @returns The file buffer
     * @throws AppError if the file is not found
     */
    getFileBuffer(bucket: string, path: string): Promise<{ headers: any; buffer: Buffer }>;

    /**
     * Downloads a file from the storage service
     * @param bucket The bucket name
     * @param path The path to the file including the file name
     * @returns The file stream
     * @throws AppError if the file is not found
     */
    getFileStream(bucket: string, path: string): Promise<{ headers: any; stream: Readable }>;
}
