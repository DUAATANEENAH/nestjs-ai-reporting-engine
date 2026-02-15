jest.mock('@prisma/client', () => ({ PrismaClient: class PrismaClient {} }));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class PrismaPg {} }));
jest.mock('pg', () => ({ Pool: class Pool {} }));

import * as exportsObj from '@src/models/reports/processors';

describe('reports/processors index', () => {
  it('exports ReportsProcessor', () => {
    expect(exportsObj.ReportsProcessor).toBeDefined();
  });
});
