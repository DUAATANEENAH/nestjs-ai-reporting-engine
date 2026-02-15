import { ReportTypes } from '@src/models/reports/enum/reportTypes.enum';
import { UploadedFileValidation } from '@src/models/reports/validation-schema/uploadFileValidation';
import * as Joi from 'joi';

describe('UploadedFileValidation', () => {
  const schema = Joi.object(UploadedFileValidation);

  it('accepts valid report type', () => {
    const { error } = schema.validate({ type: ReportTypes.USER_FEEDBACK });
    expect(error).toBeUndefined();
  });

  it('rejects unknown report type', () => {
    const { error } = schema.validate({ type: 'UNKNOWN' });
    expect(error).toBeDefined();
  });
});
