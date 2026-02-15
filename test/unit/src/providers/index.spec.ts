jest.mock('@prisma/client', () => ({ PrismaClient: class PrismaClient {} }));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class PrismaPg {} }));
jest.mock('pg', () => ({ Pool: class Pool {} }));

describe('providers index', () => {
  it('exports PrismaService', () => {
    const exportsObj = require('@providers');
    expect(exportsObj.PrismaService).toBeDefined();
  });
});
