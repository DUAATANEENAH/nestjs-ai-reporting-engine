import type { IReport } from '@entities/IReport';
import * as IReportModule from '@entities/IReport';

describe('IReport entity type', () => {
  it('accepts a valid report shape', () => {
    const report: IReport = {
      id: 'r-1',
      fileName: 'report.csv',
      filePath: '/tmp/report.csv',
      status: 'PENDING',
      aiAnalysis: { summary: 'ok' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(report.id).toBe('r-1');
    expect(report.status).toBe('PENDING');
  });

  it('loads the interface module', () => {
    expect(IReportModule).toBeDefined();
  });
});
