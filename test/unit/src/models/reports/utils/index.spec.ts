import * as exportsObj from '@reportsModels/utils';
describe('reports/utils index', () => {
  it('exports ReportMappers', () => {
    expect(exportsObj.ReportMappers).toBeDefined();
  });
});
