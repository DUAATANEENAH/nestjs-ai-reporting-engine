import { ReportsService } from '@src/models/reports/services/reports.service';
import { ReportTypes } from '@src/models/reports/enum/reportTypes.enum';
import { ReportJobNames, ReportStatus } from "@src/models/reports/enum";

describe('ReportsService', () => {
  const prismaService = { addReport: jest.fn() } as any;
  const reportingQueue = { add: jest.fn() } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds report and enqueues csv job', async () => {
    const service = new ReportsService(prismaService, reportingQueue);
    prismaService.addReport.mockResolvedValue({ id: 'r1' });

    const file = { originalname: 'report.csv', path: '/tmp/report.csv' } as Express.Multer.File;
    const result = await service.enqueueReportGeneration(file, ReportTypes.SALES_ANALYSIS);

    expect(prismaService.addReport).toHaveBeenCalledWith({
      fileName: 'report.csv',
      filePath: '/tmp/report.csv',
      status: ReportStatus.PENDING,
    });
    expect(reportingQueue.add).toHaveBeenCalledWith(ReportJobNames.PROCESS_CSV, {
      reportId: 'r1',
      filePath: '/tmp/report.csv',
      type: ReportTypes.SALES_ANALYSIS,
    });
    expect(result.reportId).toBe('r1');
  });

  it('throws normalized error on failure', async () => {
    const service = new ReportsService(prismaService, reportingQueue);
    prismaService.addReport.mockRejectedValue(new Error('db down'));

    const file = { originalname: 'report.csv', path: '/tmp/report.csv' } as Express.Multer.File;
    await expect(service.enqueueReportGeneration(file, ReportTypes.SALES_ANALYSIS)).rejects.toThrow(
      'Failed to enqueue report generation',
    );
  });
});
