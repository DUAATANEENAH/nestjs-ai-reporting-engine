import { BullModule } from '@nestjs/bullmq';
import { ReportsController } from './controllers';
import { AIService, ReportsService } from './services';
import { Module } from '@nestjs/common';
import { ReportQueueNameDefault } from '@reportsEnums';
import { PrismaService } from '@providers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import globalConfig from '@config/global';
import { ReportsProcessor } from '@reportsProcessors';
import { ReportsGateway } from '@reportsNotification';
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [globalConfig],
			isGlobal: true,
		}),
		BullModule.registerQueue({
			name: `{${
				process.env.REPORTING_QUEUE || ReportQueueNameDefault.REPORTING_QUEUE
			}}`,
		}),
	],
	controllers: [ReportsController],
	providers: [
		{
			provide: 'ConfigService',
			useValue: ConfigService,
		},
		{
			provide: 'PrismaService',
			useClass: PrismaService,
		},
		{
			provide: 'ReportsService',
			useClass: ReportsService,
		},
		{
			provide: 'ReportsProcessor',
			useClass: ReportsProcessor,
		},
		{
			provide: 'ReportsGateway',
			useClass: ReportsGateway,
		},
		{
			provide: 'AIService',
			useClass: AIService,
		},
	],
	exports: [
		{
			provide: 'ReportsService',
			useClass: ReportsService,
		},
	],
})
export class ReportModule {}
