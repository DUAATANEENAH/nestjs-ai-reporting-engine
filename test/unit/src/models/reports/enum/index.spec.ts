import * as exportsObj from '../../../../../../src/models/reports/enum';

describe('reports/enum index', () => {
  it('exports enum collections', () => {
    expect(exportsObj.ReportTypes).toBeDefined();
    expect(exportsObj.ReportJobNames).toBeDefined();
    expect(exportsObj.ReportQueueNameDefault).toBeDefined();
    expect(exportsObj.ReportStatus).toBeDefined();
  });
});
