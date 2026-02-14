import { BullModule } from '@nestjs/bullmq';
import { ReportsController } from './controllers';
import { ReportsService } from './services';
import { Module } from '@nestjs/common';
import { ReportQueueNameDefault } from './enum';
import { PrismaService } from '@providers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import globalConfig from '../../../config/global';
import { ReportsProcessor } from './processors';
import { ReportsGateway } from './notification';
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
	],
	exports: [
		{
			provide: 'ReportsService',
			useClass: ReportsService,
		},
	],
})
export class ReportModule {}
