import { PrismaService } from "@providers";

const prismaClientCtor = jest.fn();
const poolCtor = jest.fn();
const prismaPgCtor = jest.fn();

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation((...args: any[]) => {
    poolCtor(...args);
    return { mocked: true };
  }),
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation((...args: any[]) => {
    prismaPgCtor(...args);
    return { adapter: true };
  }),
}));

jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    $connect = jest.fn();
    $disconnect = jest.fn();
    report = {
      create: jest.fn(),
      update: jest.fn(),
    };
    reportData = {
      createMany: jest.fn(),
      findMany: jest.fn(),
    };

    constructor(...args: any[]) {
      prismaClientCtor(...args);
    }
  }

  return { PrismaClient: MockPrismaClient };
});


describe('PrismaService', () => {
  it('throws when DATABASE_URL is missing', () => {
    const config = { get: jest.fn().mockReturnValue(undefined) } as any;
    expect(() => new PrismaService(config)).toThrow('DATABASE_URL is not defined');
  });

  it('builds adapter and client using DATABASE_URL', () => {
    const config = { get: jest.fn().mockReturnValue('postgres://db-url') } as any;
    new PrismaService(config);

    expect(poolCtor).toHaveBeenCalledWith(expect.objectContaining({ connectionString: 'postgres://db-url' }));
    expect(prismaPgCtor).toHaveBeenCalled();
    expect(prismaClientCtor).toHaveBeenCalled();
  });

  it('handles lifecycle and CRUD wrapper methods', async () => {
    const config = { get: jest.fn().mockReturnValue('postgres://db-url') } as any;
    const service = new PrismaService(config) as any;

    service.report.create.mockResolvedValue({ id: 'r1' });
    service.report.update.mockResolvedValue({ id: 'r1' });
    service.reportData.createMany.mockResolvedValue({ count: 2 });
    service.reportData.findMany.mockResolvedValue([
      { type: 'TYPE_A', content: { a: 1 } },
      { type: 'TYPE_A', content: { a: 2 } },
    ]);

    await service.onModuleInit();
    await service.onModuleDestroy();
    expect(service.$connect).toHaveBeenCalled();
    expect(service.$disconnect).toHaveBeenCalled();

    await service.addReport({ fileName: 'x.csv', filePath: '/x.csv', status: 'PENDING' });
    await service.updateReport('r1', { status: 'COMPLETED' });
    await service.updateReportIdStatus('r1', 'FAILED');
    await service.createReportData([{ reportId: 'r1' }]);

    const sample = await service.getReadySample('r1');
    expect(sample).toEqual({ dataType: 'TYPE_A', sample: [{ a: 1 }, { a: 2 }] });
  });

  it('returns UNKNOWN dataType when no sample rows exist', async () => {
    const config = { get: jest.fn().mockReturnValue('postgres://db-url') } as any;
    const service = new PrismaService(config) as any;
    service.reportData.findMany.mockResolvedValue([]);

    await expect(service.getReadySample('r2')).resolves.toEqual({
      dataType: 'UNKNOWN',
      sample: [],
    });
  });
});
