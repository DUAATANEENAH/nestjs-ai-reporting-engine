import { ReportsGateway } from '@src/models/reports/notification/reports.gateway';

describe('ReportsGateway', () => {
  it('emits progress updates for report id', () => {
    const gateway = new ReportsGateway();
    (gateway as any).server = { emit: jest.fn() };

    gateway.sendUpdate('r1', { status: 'in_progress', progress: 20, message: 'msg' });

    expect((gateway as any).server.emit).toHaveBeenCalledWith('report_r1', {
      status: 'in_progress',
      progress: 20,
      message: 'msg',
    });
  });
});
