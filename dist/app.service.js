"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const pdftopic = require("pdftopic");
const cloudinary = require("cloudinary");
const config_1 = require("@nestjs/config");
const libre = require("libreoffice-convert");
const util = require("util");
const helper_service_1 = require("./helper/helper.service");
const convertAsync = util.promisify(libre.convert);
let AppService = class AppService {
    constructor(config, helper) {
        this.config = config;
        this.helper = helper;
        cloudinary.v2.config({
            cloud_name: this.config.get('CLOUDINARY_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET'),
        });
    }
    async getImagesFromPdf(signedUrl) {
        console.log('Signed url recieved');
        const response = await axios_1.default.get(signedUrl, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data, 'binary');
        const imageBuffers = await pdftopic.pdftobuffer(buffer, 'all');
        const uploadPromises = imageBuffers.map((buffer) => this.uploadToCloud(buffer));
        const uploads = (await Promise.allSettled(uploadPromises))
            .filter((promise) => promise.status == 'fulfilled')
            .map((promise) => promise.value);
        return {
            images: uploads.map(({ public_id, url }) => ({
                publicId: public_id,
                url,
            })),
        };
    }
    async deleteImages(imageIds) {
        console.log('Deletion triggered for ' + imageIds.join(', '));
        const deletePromise = imageIds.map((id) => this.deleteFromCloud(id));
        await Promise.all(deletePromise);
        return { status: 'OK' };
    }
    async uploadToCloud(buffer) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'convertedPitches' }, (error, result) => {
                if (error) {
                    return reject('Files connot be uploaded');
                }
                resolve(result);
            });
            uploadStream.end(buffer);
        });
    }
    async deleteFromCloud(publicId) {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject('File cannot be deleted');
                }
                resolve(result);
            });
        });
    }
    async convertFromBase64ToPdf(base64String) {
        const buffer = Buffer.from(base64String, 'base64');
        const pdfBuffer = await this.convertToPdf(buffer);
        const base64PdfBuffer = pdfBuffer.toString('base64');
        return { file: base64PdfBuffer };
    }
    async convertToPdf(buffer) {
        return await convertAsync(buffer, '.pdf', undefined);
    }
    async pdfToCombinedImage(base64String, uniqueKey) {
        const buffer = Buffer.from(base64String, 'base64');
        const imageBuffers = await pdftopic.pdftobuffer(buffer, 'all');
        const combinedBuffer = await this.helper.combineImagesVertically(imageBuffers, uniqueKey);
        const combinedImageBase64String = combinedBuffer.toString('base64');
        return { base64String: combinedImageBase64String };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        helper_service_1.HelperService])
], AppService);
//# sourceMappingURL=app.service.js.map