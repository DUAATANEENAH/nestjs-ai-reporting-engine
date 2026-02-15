import { ReportQueueNameDefault } from '../../../../../../src/models/reports/enum/reportQueueName.enum';

describe('ReportQueueNameDefault enum', () => {
  it('defines reporting queue name', () => {
    expect(ReportQueueNameDefault.REPORTING_QUEUE).toBe('report-queue');
  });
});
