import * as exportsObj from '@src/models/reports/services';

describe('reports/services index', () => {
  it('exports services', () => {
    expect(exportsObj.ReportsService).toBeDefined();
    expect(exportsObj.AIService).toBeDefined();
  });
});
