import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@providers";
import { Job } from "bullmq";
import { ReportJobNames, ReportQueueNameDefault, ReportStatus } from "../enum";

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

    private async  handleReportGeneration(job: Job<any, any, string>) {
        // Simulate report generation logic
        const { reportId, filePath } = job.data;
        console.log(`Processing report generation for report ID: ${reportId}, file path: ${filePath}`);

        switch(job.name){
            case ReportJobNames.PROCESS_CSV: 
                // Simulate CSV processing logic
                console.log(`Simulating CSV processing for report ID: ${reportId}`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate time-consuming task
                break;
            default:
                console.warn(`Unknown job name: ${job.name} for report ID: ${reportId}`);
        }

        await this.prisma.updateReportIdStatus(reportId, ReportStatus.COMPLETED);
        console.log(`Report generation completed for report ID: ${reportId}`); 
        return { success: true }; 
    }
}