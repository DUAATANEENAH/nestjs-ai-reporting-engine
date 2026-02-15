import * as exportsObj from '@src/models/reports/notification';

describe('reports/notification index', () => {
  it('exports ReportsGateway', () => {
    expect(exportsObj.ReportsGateway).toBeDefined();
  });
});
