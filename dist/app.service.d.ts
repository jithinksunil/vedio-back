/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { HelperService } from './helper/helper.service';
export declare class AppService {
    private config;
    private helper;
    constructor(config: ConfigService, helper: HelperService);
    getImagesFromPdf(signedUrl: string): Promise<{
        images: {
            publicId: string;
            url: string;
        }[];
    }>;
    deleteImages(imageIds: string[]): Promise<{
        status: string;
    }>;
    uploadToCloud(buffer: Buffer): Promise<{
        public_id: string;
        url: string;
    }>;
    deleteFromCloud(publicId: string): Promise<unknown>;
    convertFromBase64ToPdf(base64String: string): Promise<{
        file: string;
    }>;
    convertToPdf(buffer: Buffer): Promise<Buffer>;
    pdfToCombinedImage(base64String: string, uniqueKey: string): Promise<{
        base64String: string;
    }>;
}
