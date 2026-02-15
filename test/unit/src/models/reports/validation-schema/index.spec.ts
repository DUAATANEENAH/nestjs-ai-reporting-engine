import * as exportsObj from '@src/models/reports/validation-schema';

describe('reports/validation-schema index', () => {
  it('exports UploadedFileValidation', () => {
    expect(exportsObj.UploadedFileValidation).toBeDefined();
  });
});
