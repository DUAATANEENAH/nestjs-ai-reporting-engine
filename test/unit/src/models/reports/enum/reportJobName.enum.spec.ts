import { REPORT_QUEUE_CONFIG_KEY, ReportJobNames } from '../../../../../../src/models/reports/enum/reportJobName.enum';

describe('ReportJobNames enum', () => {
  it('defines PROCESS_CSV and queue config key', () => {
    expect(ReportJobNames.PROCESS_CSV).toBe('process-csv');
    expect(REPORT_QUEUE_CONFIG_KEY).toBe('REPORTING_QUEUE_NAME');
  });
});
