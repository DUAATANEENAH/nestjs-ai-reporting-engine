import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { IReport, IReportData } from '@entities';
import { ReportStatus, ReportTypes } from '@reportsEnums';

export interface IPrismaService {
	addReport(report: { fileName: string; filePath: string; status: string }): Promise<any>;
	updateReportIdStatus(reportId: string, status: string): Promise<any>;
	createReportData(data: any[]): Promise<any>;
	updateReport(reportId: string, updateData: any): Promise<any>;
	getReadySample(reportId: string): Promise<{ dataType: string; sample: any[] }>;
}

@Injectable()
export class PrismaService extends PrismaClient implements IPrismaService, OnModuleInit, OnModuleDestroy {

	constructor(private config: ConfigService) {
		const connectionString = config.get<string>('global.DATABASE_URL');
		if (!connectionString) {
			throw new Error('DATABASE_URL is not defined in .env file');
		}
		const pool = new Pool({
			connectionString,
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		});

		const adapter = new PrismaPg(pool);

		super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	public async addReport(report: IReport): Promise<any> {
		return await this.report.create({
			data: report,
		});
	}

	public async updateReport(reportId: string, updateData: Record<string, any>): Promise<any> {
		return await this.report.update({
			where: { id: reportId },
			data: { ...updateData },
		});
	}

	public async updateReportIdStatus(reportId: string, status: ReportStatus): Promise<any> {
		return await this.report.update({
			where: { id: reportId },
			data: { status },
		});
	}

	public async createReportData(data: IReportData[]): Promise<any> {
		return await this.reportData.createMany({ data });
	}

	public async getReadySample(reportId: string): Promise<{ dataType: ReportTypes; sample: any[] }> {
		const rawRows = await this.reportData.findMany({
			where: { reportId },
			take: 10,
			select: {
				content: true, type: true,

			},
		});
		return {
			dataType: (rawRows[0]?.type || 'UNKNOWN') as ReportTypes,
			sample: rawRows.map(row => row.content),
		};
	}

}
