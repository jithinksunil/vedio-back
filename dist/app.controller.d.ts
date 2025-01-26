import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getImagesFromPdf(body: {
        signedUrl: string;
    }): Promise<{
        images: {
            publicId: string;
            url: string;
        }[];
    }>;
    pdfToCombinedImage(body: {
        base64String: string;
    }, ip: string): Promise<{
        base64String: string;
    }>;
    deleteImages(body: string[]): Promise<{
        status: string;
    }>;
    convertFileBufferToPdfBuffer(data: {
        file: string;
    }): Promise<{
        file: string;
    }>;
}
