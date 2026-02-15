import { ReportTypes } from '../../../../../../src/models/reports/enum/reportTypes.enum';

describe('ReportTypes enum', () => {
  it('contains all report types', () => {
    expect(ReportTypes.SALES_ANALYSIS).toBe('SALES_ANALYSIS');
    expect(ReportTypes.USER_FEEDBACK).toBe('USER_FEEDBACK');
    expect(ReportTypes.INVENTORY_AUDIT).toBe('INVENTORY_AUDIT');
    expect(ReportTypes.MARKETING_LEADS).toBe('MARKETING_LEADS');
  });
});
