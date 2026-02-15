const createMock = jest.fn();
const createDocumentMock = jest.fn();
const setupMock = jest.fn();
const listenMock = jest.fn();
const setTitleMock = jest.fn();
const setDescriptionMock = jest.fn();
const setVersionMock = jest.fn();
const buildMock = jest.fn();

jest.mock('@src/app.module', () => ({
  AppModule: class AppModule {},
}));

jest.mock('@nestjs/core', () => ({
  NestFactory: { create: (...args: any[]) => createMock(...args) },
}));

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: (...args: any[]) => setTitleMock(...args),
    setDescription: (...args: any[]) => setDescriptionMock(...args),
    setVersion: (...args: any[]) => setVersionMock(...args),
    build: (...args: any[]) => buildMock(...args),
  })),
  SwaggerModule: {
    createDocument: (...args: any[]) => createDocumentMock(...args),
    setup: (...args: any[]) => setupMock(...args),
  },
  ApiBody: () => () => undefined,
  ApiConsumes: () => () => undefined,
  ApiOperation: () => () => undefined,
  ApiParam: () => () => undefined,
  ApiResponse: () => () => undefined,
  ApiTags: () => () => undefined,
}));

describe('bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    setTitleMock.mockReturnValue({
      setDescription: (...args: any[]) => setDescriptionMock(...args),
      setVersion: (...args: any[]) => setVersionMock(...args),
      build: (...args: any[]) => buildMock(...args),
    });
    setDescriptionMock.mockReturnValue({
      setVersion: (...args: any[]) => setVersionMock(...args),
      build: (...args: any[]) => buildMock(...args),
    });
    setVersionMock.mockReturnValue({ build: (...args: any[]) => buildMock(...args) });
    buildMock.mockReturnValue({ openapi: '3.0.0' });

    listenMock.mockResolvedValue(undefined);
    createMock.mockResolvedValue({ listen: (...args: any[]) => listenMock(...args) });
    createDocumentMock.mockReturnValue({ paths: {} });
  });

  it('creates app, configures swagger, and listens', async () => {
    await jest.isolateModules(async () => {
      await import('@src/main');
    });

    await new Promise((resolve) => setImmediate(resolve));

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createDocumentMock).toHaveBeenCalled();
    expect(setupMock).toHaveBeenCalledWith('docs', expect.any(Object), expect.any(Object));
    expect(listenMock).toHaveBeenCalledWith(3000);
  });
});
