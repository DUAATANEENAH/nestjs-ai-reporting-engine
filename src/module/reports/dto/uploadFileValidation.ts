import * as Joi from 'joi';
import { ReportTypes } from '../enum';

export const UploadedFileValidation = {
	type: Joi.string()
		.valid(...Object.values(ReportTypes))
		.required(),
};
