/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
export declare class FileService {
    private config;
    constructor(config: ConfigService);
    private s3;
    uploadFile(buffer: Buffer, organizationName: string, name: string): Promise<{
        file: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<{
        data: import("aws-sdk/lib/request").PromiseResult<S3.DeleteObjectOutput, import("aws-sdk").AWSError>;
    }>;
    getPublicUrl(key: string): Promise<{
        url: string;
    }>;
}
