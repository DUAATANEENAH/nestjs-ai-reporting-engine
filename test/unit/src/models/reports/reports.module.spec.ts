import { MODULE_METADATA } from '@nestjs/common/constants';

jest.mock('@prisma/client', () => ({ PrismaClient: class PrismaClient {} }));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class PrismaPg {} }));
jest.mock('pg', () => ({ Pool: class Pool {} }));

describe('ReportModule', () => {
  it('defines imports, providers, and exports', () => {
    const { ReportModule } = require('@src/models/reports/reports.module');
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, ReportModule) || [];
    const providers = Reflect.getMetadata(MODULE_METADATA.PROVIDERS, ReportModule) || [];
    const exported = Reflect.getMetadata(MODULE_METADATA.EXPORTS, ReportModule) || [];

    expect(imports.length).toBeGreaterThan(0);
    expect(providers.length).toBeGreaterThan(0);
    expect(exported.length).toBeGreaterThan(0);
  });
});
