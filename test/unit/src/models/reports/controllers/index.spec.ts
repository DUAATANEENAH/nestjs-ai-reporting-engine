import * as exportsObj from '@src/models/reports/controllers';

describe('reports/controllers index', () => {
  it('exports ReportsController', () => {
    expect(exportsObj.ReportsController).toBeDefined();
  });
});
