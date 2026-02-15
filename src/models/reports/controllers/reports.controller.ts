import {
	Controller,
	Inject,
	Logger,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
	UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ValidationPipe } from '@common';
import { ReportsService } from '@reportsServices';
import { ReportTypes } from '@reportsEnums';
import { UploadedFileValidation } from '@reportsValidationSchema';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
	private logger;
	constructor(
		@Inject('ReportsService') private reportsService: ReportsService,
	) {
		this.logger = new Logger('ReportsController');
	}

	@Post('upload/:type')
	@ApiOperation({ summary: 'Upload a report file and enqueue processing' })
	@ApiConsumes('multipart/form-data')
	@ApiParam({
		name: 'type',
		enum: ReportTypes,
		required: true,
		description: 'Report type used by the processing pipeline',
	})
	@ApiBody({
		schema: {
			type: 'object',
			required: ['file'],
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Report enqueued successfully',
		schema: {
			type: 'object',
			properties: {
				message: { type: 'string', example: 'Report enqueued successfully' },
				reportId: { type: 'string', example: 'clx123reportid' },
				filePath: { type: 'string', example: 'uploads/file-123.csv' },
			},
		},
	})
	@ApiResponse({ status: 400, description: 'Validation failed' })
	@ApiResponse({ status: 500, description: 'Failed to upload report' })
	@UsePipes(new ValidationPipe(UploadedFileValidation, 'param'))
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, callback) => {
					const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
					const extension = file.originalname.split('.').pop();
					const filename = `${file.fieldname}-${uniqueSuffix}.${extension}`;
					callback(null, filename);
				},
			}),
		}),
	)
	async uploadReport(
	@Param() param: { type: ReportTypes },
		@UploadedFile() file: Express.Multer.File,
	) {
		try {
			return await this.reportsService.enqueueReportGeneration(
				file,
				param?.type,
			);
		} catch (error) {
			this.logger.error('Error uploading report:', error);
			throw new Error('Failed to upload report');
		}
	}
}
