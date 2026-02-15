import type { IReportData } from '@entities/IReportData';
import * as IReportDataModule from '@entities/IReportData';

describe('IReportData entity type', () => {
  it('accepts a valid report-data shape', () => {
    const reportData: IReportData = {
      _id: 'rd-1',
      reportId: 'r-1',
      type: 'SALES',
      content: { amount: 99 },
      email: 'user@example.com',
      createdAt: new Date(),
    };

    expect(reportData.reportId).toBe('r-1');
    expect(reportData.type).toBe('SALES');
  });

  it('loads the interface module', () => {
    expect(IReportDataModule).toBeDefined();
  });
});
