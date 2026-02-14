import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@providers';
import { Job } from 'bullmq';
import { ReportJobNames, ReportQueueNameDefault } from '../enum';
import { ReportStatus } from '../enum';
import * as csvParser from 'csv-parser';
import { ReportMappers } from '../utils';
import * as fs from 'fs';
import { ReportsGateway } from '../notification';

export interface IReportsProcessor {
	process(job: Job<any, any, string>): Promise<any>;
}

@Processor(`{${process.env.REPORTING_QUEUE || ReportQueueNameDefault.REPORTING_QUEUE}}`)
export class ReportsProcessor extends WorkerHost implements IReportsProcessor {
	private logger;

	constructor(@Inject('PrismaService') private readonly prisma: PrismaService,
	@Inject('ReportsGateway') private readonly reportsGateway: ReportsGateway,
) {
		super();
		this.logger = new Logger('ReportsProcessor');
	}
	public async process(job: Job<any, any, string>): Promise<any> {
		try {
			return await this.handleReportGeneration(job);
		} catch (error) {
			this.logger.error(`Error processing report generation job for report ID: ${job.data.reportId}`, error);
			await this.prisma.updateReportIdStatus(job.data.reportId, ReportStatus.FAILED);
		}
	}

	private async handleReportGeneration(job: Job<any, any, string>) {
		// handle report generation logic
		const { reportId, filePath } = job.data;
		this.reportsGateway.sendUpdate(reportId, { status: 'in_progress', progress: 0, message: 'Report generation started' });
		this.logger.log(`Processing report generation for report ID: ${reportId}, file path: ${filePath}`);
		try {
			switch (job.name as ReportJobNames) {
				case ReportJobNames.PROCESS_CSV:
					// handle CSV processing logic
					this.logger.log(`handle CSV processing for report ID: ${reportId}`);
					await this.handleCSVReportGeneration(job);
					break;
				default:
					this.logger.warn(`Unknown job name: ${job.name} for report ID: ${reportId}`);
			}
		} catch (error) {
			this.logger.error(`Error in handleReportGeneration for report ID: ${job.data.reportId}`, error);
			throw error;
		}

		await this.prisma.updateReportIdStatus(reportId, ReportStatus.COMPLETED);
		this.logger.log(`Report generation completed for report ID: ${reportId}`);
		return { success: true };
	}

	private async handleCSVReportGeneration(job: Job<any, any, string>) {
		try {
			const { reportId, filePath, type } = job.data;
			const mapper = ReportMappers[type] || ReportMappers.DEFAULT;
			this.logger.log(`Processing CSV report generation for report ID: ${reportId}, file path: ${filePath}, type: ${type}`);
			await this.prisma.updateReportIdStatus(reportId, ReportStatus.IN_PROGRESS);

			// handle CSV processing logic with batch processing
			const bachSize = 1000;
			let totalRows = 0;
			let rowNumber = 0;
			let progress = 0;

			const batch = [];
			return new Promise((resolve, reject) => {
				const stream = fs.createReadStream(filePath).pipe(csvParser());
				totalRows = stream.readableLength; // Get total rows for progress calculation
				stream.on('data', async (data) => {
					rowNumber++;
					const mappedData = mapper(data);
					batch.push({
						reportId,
						...mappedData,
						type,
					});
					if (batch.length >= bachSize) {
						progress = Math.round((rowNumber/ totalRows) * 100);
						this.reportsGateway.sendUpdate(reportId, { status: 'in_progress', progress, message: `Processing batch of ${batch.length} records` });
						await this.prisma.createReportData(batch);
						stream.pause();
						batch.length = 0;
						stream.resume();
					}
				});
				stream.on('end', async () => {
					if (batch.length > 0) {
						this.reportsGateway.sendUpdate(reportId, { status: 'in_progress', progress: 100, message: `Processing final batch of ${batch.length} records` });
						await this.prisma.createReportData(batch);
					}
					resolve(true);
				});
				stream.on('error', (error) => {
					this.reportsGateway.sendUpdate(reportId, { status: 'failed', progress, message: 'Error processing CSV file' });
					this.logger.error(`Error processing CSV stream for report ID: ${reportId}`, error);
					reject(error);
				});
			});

		} catch (error) {
			this.logger.error(`Error in handleCSVReportGeneration for report ID: ${job.data.reportId}`, error);
			throw error; // Rethrow to be caught by the main process method
		}

	}
}
