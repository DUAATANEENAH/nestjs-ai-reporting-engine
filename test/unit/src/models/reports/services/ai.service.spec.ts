import { AIService } from "@src/models/reports/services";

const generateContentMock = jest.fn();
const getGenerativeModelMock = jest.fn();
const googleCtorMock = jest.fn();

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation((...args: any[]) => {
    googleCtorMock(...args);
    return { getGenerativeModel: (...innerArgs: any[]) => getGenerativeModelMock(...innerArgs) };
  }),
}));


describe('AIService', () => {
  const configService = { get: jest.fn().mockReturnValue('test-google-api') } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    getGenerativeModelMock.mockReturnValue({
      generateContent: (...args: any[]) => generateContentMock(...args),
    });
  });

  it('creates Google model with configured key', () => {
    new AIService(configService);
    expect(googleCtorMock).toHaveBeenCalledWith('test-google-api');
    expect(getGenerativeModelMock).toHaveBeenCalledWith({ model: 'gemini-3-flash-preview' });
  });

  it('falls back to env api key when config key is missing', () => {
    process.env.GOOGLE_API_KEY = 'env-key';
    const emptyConfig = { get: jest.fn().mockReturnValue(undefined) } as any;

    new AIService(emptyConfig);
    expect(googleCtorMock).toHaveBeenCalledWith('env-key');
  });

  it('returns parsed AI JSON response', async () => {
    const service = new AIService(configService);
    generateContentMock.mockResolvedValue({ response: { text: () => '{"summary":"ok"}' } });

    const result = await service.analyzeDataWithAI({ dataType: 'X', sample: [{ a: 1 }] });
    expect(result).toEqual({ summary: 'ok' });
  });

  it('throws normalized error when model call fails', async () => {
    const service = new AIService(configService);
    generateContentMock.mockRejectedValue(new Error('fail'));

    await expect(service.analyzeDataWithAI({ dataType: 'X', sample: [] })).rejects.toThrow(
      'Failed to analyze data with AI',
    );
  });

  it('returns empty object when model returns empty string', async () => {
    const service = new AIService(configService);
    generateContentMock.mockResolvedValue({ response: { text: () => '' } });

    await expect(service.analyzeDataWithAI({ dataType: 'X', sample: [] })).resolves.toEqual(
      {},
    );
  });

  it('returns empty object when response text accessor is missing', async () => {
    const service = new AIService(configService);
    generateContentMock.mockResolvedValue({ response: undefined });

    await expect(service.analyzeDataWithAI({ dataType: 'X', sample: [] })).resolves.toEqual(
      {},
    );
  });
});
