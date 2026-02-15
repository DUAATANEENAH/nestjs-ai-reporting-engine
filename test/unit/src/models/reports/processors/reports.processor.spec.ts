jest.mock('@prisma/client', () => ({ PrismaClient: class PrismaClient {} }));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class PrismaPg {} }));
jest.mock('pg', () => ({ Pool: class Pool {} }));

import { ReportsProcessor } from '@src/models/reports/processors/reports.processor';
import { ReportStatus, ReportJobNames, ReportTypes } from "@src/models/reports/enum";
describe('ReportsProcessor', () => {
  const prisma = {
    updateReportIdStatus: jest.fn(),
    updateReport: jest.fn(),
    getReadySample: jest.fn(),
  } as any;
  const reportsGateway = { sendUpdate: jest.fn() } as any;
  const aiService = { analyzeDataWithAI: jest.fn() } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('processes job via handleReportGeneration', async () => {
    const processor = new ReportsProcessor(prisma, reportsGateway, aiService) as any;
    jest.spyOn(processor, 'handleReportGeneration').mockResolvedValue({ success: true });

    const result = await processor.process({ data: { reportId: 'r1' } } as any);
    expect(result).toEqual({ success: true });
  });

  it('marks report failed when process throws', async () => {
    const processor = new ReportsProcessor(prisma, reportsGateway, aiService) as any;
    jest.spyOn(processor, 'handleReportGeneration').mockRejectedValue(new Error('boom'));

    await processor.process({ data: { reportId: 'r1' } } as any);
    expect(prisma.updateReportIdStatus).toHaveBeenCalledWith('r1', ReportStatus.FAILED);
  });

  it('handles PROCESS_CSV workflow and completes report', async () => {
    const processor = new ReportsProcessor(prisma, reportsGateway, aiService) as any;
    jest.spyOn(processor, 'handleCSVReportGeneration').mockResolvedValue(true);
    jest.spyOn(processor, 'handleAIReportGeneration').mockResolvedValue(true);

    const job = {
      name: ReportJobNames.PROCESS_CSV,
      data: { reportId: 'r1', filePath: '/tmp/r.csv', type: ReportTypes.SALES_ANALYSIS },
    } as any;

    const result = await processor.handleReportGeneration(job);
    expect(result).toEqual({ success: true });
    expect(reportsGateway.sendUpdate).toHaveBeenCalledWith('r1', {
      status: 'in_progress',
      progress: 0,
      message: 'Report generation started',
    });
    expect(prisma.updateReportIdStatus).toHaveBeenCalledWith('r1', ReportStatus.COMPLETED);
  });

  it('handles AI report generation and stores analysis', async () => {
    const processor = new ReportsProcessor(prisma, reportsGateway, aiService) as any;
    prisma.getReadySample.mockResolvedValue({ dataType: 'X', sample: [{ a: 1 }] });
    aiService.analyzeDataWithAI.mockResolvedValue({ summary: 'done' });

    const job = { data: { reportId: 'r1', filePath: '/tmp/r.csv' } } as any;
    await processor.handleAIReportGeneration(job);

    expect(prisma.updateReportIdStatus).toHaveBeenCalledWith('r1', ReportStatus.AI_ANALYSIS);
    expect(prisma.updateReport).toHaveBeenCalledWith('r1', {
      aiAnalysis: { summary: 'done' },
    });
  });
});
