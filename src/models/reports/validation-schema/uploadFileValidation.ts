import * as Joi from 'joi';
import { ReportTypes } from '@reportsEnums';

export const UploadedFileValidation = {
	type: Joi.string()
		.valid(...Object.values(ReportTypes))
		.required(),
};
