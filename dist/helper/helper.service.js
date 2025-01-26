"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const child_process_1 = require("child_process");
let HelperService = class HelperService {
    generateFileName(uniqueKey) {
        const randomStr = Math.random().toString(36).substring(2, 10);
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
        const fileName = `${uniqueKey}_${randomStr}_${timestamp}`;
        return fileName;
    }
    async combineImagesVertically(bufferArray, uniqueKey) {
        const imagePaths = bufferArray.map((buffer) => {
            let filePath = `./images/${this.generateFileName(uniqueKey)}.jpg`;
            while (fs.existsSync(filePath)) {
                filePath = `./images/${this.generateFileName(uniqueKey)}.jpg`;
            }
            fs.writeFileSync(filePath, buffer);
            return filePath;
        });
        return new Promise((resolve, reject) => {
            let outputPath = `./images/${this.generateFileName(uniqueKey)}_combined.jpg`;
            const command = `magick convert ${imagePaths.join(' ')} -append ${outputPath}`;
            (0, child_process_1.exec)(command, (error) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    reject('Error combining images');
                }
                const arraybuffer = fs.readFileSync(outputPath);
                imagePaths.map((path) => fs.unlink(path, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                }));
                fs.unlink(outputPath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
                resolve(Buffer.from(arraybuffer));
            });
        });
    }
};
exports.HelperService = HelperService;
exports.HelperService = HelperService = __decorate([
    (0, common_1.Injectable)()
], HelperService);
//# sourceMappingURL=helper.service.js.map