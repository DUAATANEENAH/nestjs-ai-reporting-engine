import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './module/reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import globalConfig from '../config/global';
import { BullModule } from '@nestjs/bullmq';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [globalConfig],
			isGlobal: true,
		}),
		BullModule.forRoot({
			connection: {
				host: process.env.REDIS_HOST || 'localhost',
				port: Number(process.env.REDIS_PORT) || 6379,
				password: process.env.REDIS_PASSWORD || undefined },
		}),
		ReportModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: 'ConfigService',
			useValue: ConfigService,
		},
	],
})
export class AppModule {}
