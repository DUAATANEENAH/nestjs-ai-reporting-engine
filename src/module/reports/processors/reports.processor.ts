import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { PrismaService } from "@providers";
import { Job } from "bullmq";
import { ReportJobNames, ReportQueueNameDefault } from "../enum";
import { ReportStatus } from "../enum";
import * as csvParser from "csv-parser";
import { ReportMappers } from "../utils";
import *  as fs from "fs";


export interface IReportsProcessor {
    process(job: Job<any, any, string>): Promise<any>;
}

@Processor(`{${process.env.REPORTING_QUEUE || ReportQueueNameDefault.REPORTING_QUEUE}}`)
export class ReportsProcessor extends WorkerHost implements IReportsProcessor {

    constructor(@Inject('PrismaService') private readonly prisma: PrismaService) {
        super();
    }
    public async process(job: Job<any, any, string>): Promise<any> {
        try {
            return await this.handleReportGeneration(job);
        } catch (error) {
            console.error(`Error processing report generation job for report ID: ${job.data.reportId}`, error);
            await this.prisma.updateReportIdStatus(job.data.reportId, ReportStatus.FAILED);
        }
    }

    private async handleReportGeneration(job: Job<any, any, string>) {
        // handle report generation logic
        const { reportId, filePath } = job.data;
        console.log(`Processing report generation for report ID: ${reportId}, file path: ${filePath}`);
        try {
            switch (job.name) {
                case ReportJobNames.PROCESS_CSV:
                    // handle CSV processing logic
                    console.log(`handle CSV processing for report ID: ${reportId}`);
                    await this.handleCSVReportGeneration(job);
                    break;
                default:
                    console.warn(`Unknown job name: ${job.name} for report ID: ${reportId}`);
            }
        } catch (error) {
            console.error(`Error in handleReportGeneration for report ID: ${job.data.reportId}`, error);
            throw error;
        }

        await this.prisma.updateReportIdStatus(reportId, ReportStatus.COMPLETED);
        console.log(`Report generation completed for report ID: ${reportId}`);
        return { success: true };
    }

    private async handleCSVReportGeneration(job: Job<any, any, string>) {
        try {
            const { reportId, filePath, type } = job.data;
            const mapper = ReportMappers[type] || ReportMappers.DEFAULT;
            console.log(`Processing CSV report generation for report ID: ${reportId}, file path: ${filePath}, type: ${type}`);
            await this.prisma.updateReportIdStatus(reportId, ReportStatus.IN_PROGRESS);

            // handle CSV processing logic with batch processing
            const bachSize = 1000;

            const batch = [];
                return new Promise( (resolve, reject) => {
                    const stream = fs.createReadStream(filePath).pipe(csvParser());
                    stream.on('data', async (data) => {
                        const mappedData = mapper(data);
                        batch.push({
                            reportId,
                            ...mappedData,
                            type,
                        });
                        if (batch.length >= bachSize) {
                            await this.prisma.createReportData(batch);
                            stream.pause();
                            batch.length = 0;
                            stream.resume();
                        }
                    });
                    stream.on('end', async () => {
                        if (batch.length > 0) {
                            await this.prisma.createReportData(batch);
                        }
                        resolve(true);
                    });
                    stream.on('error', (error) => {
                        console.error(`Error processing CSV stream for report ID: ${reportId}`, error);
                        reject(error);
                    });
                });

        } catch (error) {
            console.error(`Error in handleCSVReportGeneration for report ID: ${job.data.reportId}`, error);
            throw error; // Rethrow to be caught by the main process method
        }

    }
}