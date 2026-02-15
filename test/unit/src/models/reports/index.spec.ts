jest.mock('@prisma/client', () => ({ PrismaClient: class PrismaClient {} }));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class PrismaPg {} }));
jest.mock('pg', () => ({ Pool: class Pool {} }));

describe('reports index', () => {
  it('exports report module public API', () => {
    const exportsObj = require('@src/models/reports');
    expect(exportsObj.ReportsService).toBeDefined();
    expect(exportsObj.ReportsController).toBeDefined();
    expect(exportsObj.ReportsProcessor).toBeDefined();
    expect(exportsObj.ReportTypes).toBeDefined();
    expect(exportsObj.ReportJobNames).toBeDefined();
    expect(exportsObj.ReportQueueNameDefault).toBeDefined();
  });
});
