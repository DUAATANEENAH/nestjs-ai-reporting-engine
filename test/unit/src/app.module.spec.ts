import { MODULE_METADATA } from '@nestjs/common/constants';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';

jest.mock('@src/models/reports/reports.module', () => ({
  ReportModule: class ReportModule {},
}));

describe('AppModule', () => {
  it('contains expected module metadata', () => {
    const { AppModule } = require('@src/app.module');
    const controllers = Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, AppModule) || [];
    const providers = Reflect.getMetadata(MODULE_METADATA.PROVIDERS, AppModule) || [];

    expect(controllers).toContain(AppController);
    expect(providers).toEqual(expect.arrayContaining([AppService]));
  });
});
