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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
let FileService = class FileService {
    constructor(config) {
        this.config = config;
        const secretAccessKey = this.config.get('AWS_SECRET_ACCESS_KEY');
        const accessKeyId = this.config.get('AWS_ACCESS_KEY_ID');
        this.s3 = new aws_sdk_1.S3({
            accessKeyId,
            secretAccessKey,
        });
        console.log({
            accessKeyId,
            secretAccessKey,
        });
    }
    async uploadFile(buffer, organizationName, name) {
        const bucket = this.config.get('AWS_BUCKET_NAME');
        const date = new Date();
        const prepend = String(date.getTime());
        const params = {
            Bucket: bucket,
            Key: `${organizationName.split(' ').join('_')}/${String(`${prepend}_${name}`)}`,
            Body: buffer,
            ACL: 'public-read',
        };
        const data = await this.s3.upload(params).promise();
        return {
            file: data.Location,
            key: data.Key,
        };
    }
    async deleteFile(key) {
        const bucket = this.config.get('AWS_BUCKET_NAME');
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const data = await this.s3.deleteObject(params).promise();
        return { data };
    }
    async getPublicUrl(key) {
        const bucket = this.config.get('AWS_BUCKET_NAME');
        const secretAccessKey = this.config.get('AWS_SECRET_ACCESS_KEY');
        const accessKeyId = this.config.get('AWS_ACCESS_KEY_ID');
        const s3 = new aws_sdk_1.S3({
            accessKeyId,
            secretAccessKey,
        });
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const url = await s3.getSignedUrlPromise('getObject', params);
        return { url };
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileService);
//# sourceMappingURL=file.service.js.map