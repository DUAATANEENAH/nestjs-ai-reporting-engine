import { ReportsController } from '@src/models/reports/controllers/reports.controller';
import { ReportTypes } from '@src/models/reports/enum/reportTypes.enum';

describe('ReportsController', () => {
  const reportsService = { enqueueReportGeneration: jest.fn() } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates upload to ReportsService', async () => {
    const controller = new ReportsController(reportsService);
    const file = { originalname: 'report.csv', path: '/tmp/report.csv' } as Express.Multer.File;

    reportsService.enqueueReportGeneration.mockResolvedValue({ message: 'ok' });

    const result = await controller.uploadReport({ type: ReportTypes.SALES_ANALYSIS }, file);
    expect(result).toEqual({ message: 'ok' });
    expect(reportsService.enqueueReportGeneration).toHaveBeenCalledWith(file, ReportTypes.SALES_ANALYSIS);
  });

  it('throws normalized error when service fails', async () => {
    const controller = new ReportsController(reportsService);
    const file = { originalname: 'report.csv', path: '/tmp/report.csv' } as Express.Multer.File;

    reportsService.enqueueReportGeneration.mockRejectedValue(new Error('fail'));

    await expect(
      controller.uploadReport({ type: ReportTypes.SALES_ANALYSIS }, file),
    ).rejects.toThrow('Failed to upload report');
  });
});
