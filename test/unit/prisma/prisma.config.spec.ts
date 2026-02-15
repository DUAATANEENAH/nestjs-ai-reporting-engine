const dotenvConfigMock = jest.fn();
const defineConfigMock = jest.fn((v) => v);

jest.mock('dotenv', () => ({
  config: (...args: any[]) => dotenvConfigMock(...args),
}));

jest.mock('@prisma/config', () => ({
  defineConfig: (value: any) => defineConfigMock(value),
}));

describe('prisma config', () => {
  it('loads dotenv and defines datasource url from env', async () => {
    process.env.DATABASE_URL = 'postgres://prisma-db';

    const mod = await import('../../../prisma/prisma.config');
    const cfg = mod.default as any;

    expect(dotenvConfigMock).toHaveBeenCalled();
    expect(defineConfigMock).toHaveBeenCalled();
    expect(cfg.datasource.url).toBe('postgres://prisma-db');
  });
});
