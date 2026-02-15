import { AppController } from "@src/app.controller";
import { AppService } from "@src/app.service";

describe('AppController', () => {
  it('returns hello through app service', () => {
    const service = new AppService();
    const controller = new AppController(service);

    expect(controller.getHello()).toBe('Hello World!');
  });
});
