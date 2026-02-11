import { Inject, Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { ReportJobNames, ReportQueueNameDefault, ReportTypes } from "../enum";
import { IPrismaService } from "@providers";
import { ReportStatus } from "../enum/reportStatus.enum";


const REPORTING_QUEUE = `{${process.env.REPORTING_QUEUE || ReportQueueNameDefault.REPORTING_QUEUE}}`;
export interface IReportsService {
    setEnqueueReportGeneration(File: Express.Multer.File, type: ReportTypes): Promise<Record<string, any>>;
}
@Injectable()
export class ReportsService {
    constructor(
        @Inject('PrismaService') private prismaService: IPrismaService,
        @InjectQueue(REPORTING_QUEUE) public reportingQueue: Queue,
    ) { }

    async enqueueReportGeneration(File: Express.Multer.File, type: ReportTypes): Promise<Record<string, any>> {
        try {
            const report = await this.prismaService.addReport({
                fileName: File.originalname,
                filePath: File.path,
                status: ReportStatus.PENDING,
            });

            await this.reportingQueue.add(ReportJobNames.PROCESS_CSV, {
                reportId: report.id,
                filePath: File.path,
                type: type,
            });

            return {
                message: 'Report enqueued successfully',
                reportId: report.id,
                filePath: File.path,
            }
        } catch (error) {
            console.error('Error enqueuing report generation:', error);
            throw new Error('Failed to enqueue report generation');
        }
    }

}