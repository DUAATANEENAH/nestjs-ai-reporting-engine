import globalConfig from '../../../config/global';

describe('global config', () => {
  it('returns env values when present', () => {
    process.env.DATABASE_URL = 'postgres://custom';
    process.env.GOOGLE_API_KEY = 'key-123';

    const cfg = (globalConfig as any)();
    expect(cfg.DATABASE_URL).toBe('postgres://custom');
    expect(cfg.GOOGLE_API_KEY).toBe('key-123');
  });

  it('returns defaults when env is missing', () => {
    delete process.env.DATABASE_URL;
    delete process.env.GOOGLE_API_KEY;

    const cfg = (globalConfig as any)();
    expect(cfg.DATABASE_URL).toContain('postgresql://user_admin:password123');
    expect(cfg.GOOGLE_API_KEY).toContain('EXAMPLE-KEY');
  });
});
