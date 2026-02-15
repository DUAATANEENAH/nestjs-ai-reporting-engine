import { ReportTypes } from '../../../../../../src/models/reports/enum';
import { ReportMappers } from '../../../../../../src/models/reports/utils/report-mappers';

describe('ReportMappers', () => {
  it('maps sales analysis rows', () => {
    expect(ReportMappers[ReportTypes.SALES_ANALYSIS]({ customer_email: 'a@x.com', foo: 1 })).toEqual({
      email: 'a@x.com',
      content: { customer_email: 'a@x.com', foo: 1 },
    });
  });

  it('maps sales analysis rows using email fallback', () => {
    expect(ReportMappers[ReportTypes.SALES_ANALYSIS]({ email: 'fallback@x.com' })).toEqual({
      email: 'fallback@x.com',
      content: { email: 'fallback@x.com' },
    });
  });

  it('maps user feedback rows', () => {
    expect(ReportMappers[ReportTypes.USER_FEEDBACK]({ reviewer_email: 'b@x.com' })).toEqual({
      email: 'b@x.com',
      content: { reviewer_email: 'b@x.com' },
    });
  });

  it('maps inventory rows with null email', () => {
    expect(ReportMappers[ReportTypes.INVENTORY_AUDIT]({ sku: '1' })).toEqual({
      email: null,
      content: { sku: '1' },
    });
  });

  it('maps marketing leads rows', () => {
    expect(ReportMappers[ReportTypes.MARKETING_LEADS]({ lead_email: 'c@x.com' })).toEqual({
      email: 'c@x.com',
      content: { lead_email: 'c@x.com' },
    });
  });

  it('maps marketing leads rows using generic email fallback', () => {
    expect(ReportMappers[ReportTypes.MARKETING_LEADS]({ email: 'lead@x.com' })).toEqual({
      email: 'lead@x.com',
      content: { email: 'lead@x.com' },
    });
  });

  it('provides default mapper', () => {
    expect(ReportMappers.DEFAULT({ raw: true })).toEqual({ content: { raw: true } });
  });
});
