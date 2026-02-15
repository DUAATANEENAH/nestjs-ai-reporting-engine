import { ReportStatus } from '../../../../../../src/models/reports/enum/reportStatus.enum';

describe('ReportStatus enum', () => {
  it('contains expected statuses', () => {
    expect(ReportStatus.PENDING).toBe('PENDING');
    expect(ReportStatus.IN_PROGRESS).toBe('IN_PROGRESS');
    expect(ReportStatus.AI_ANALYSIS).toBe('AI_ANALYSIS');
    expect(ReportStatus.COMPLETED).toBe('COMPLETED');
    expect(ReportStatus.FAILED).toBe('FAILED');
  });
});
