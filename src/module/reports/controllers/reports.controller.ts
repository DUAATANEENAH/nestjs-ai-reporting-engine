import { Controller, Inject, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ReportsService } from "../services";

@Controller('reports')
export class ReportsController {

    constructor(
        @Inject('ReportsService') private reportsService: ReportsService,
    ) { }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = file.originalname.split('.').pop();
                const filename = `${file.fieldname}-${uniqueSuffix}.${extension}`;
                callback(null, filename);
            }
        })
    }))
    async uploadReport(@UploadedFile() file: Express.Multer.File) {
        try {
            return await this.reportsService.enqueueReportGeneration(file);

        } catch (error) {
            console.error('Error uploading report:', error);
            throw new Error('Failed to upload report');
        }
    }


}