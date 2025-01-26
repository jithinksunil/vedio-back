/// <reference types="node" />
export declare class HelperService {
    generateFileName(uniqueKey: string): string;
    combineImagesVertically(bufferArray: Buffer[], uniqueKey: string): Promise<Buffer>;
}
