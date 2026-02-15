import { BadRequestException } from '@nestjs/common';
import { ValidationPipe } from '@src/common';
import * as Joi from 'joi';

describe('ValidationPipe', () => {
  const schema = { name: Joi.string().required() };

  it('passes valid payload', () => {
    const pipe = new ValidationPipe(schema);
    const payload = { name: 'valid' } as any;

    expect(pipe.transform(payload, { type: 'body', data: '' })).toBe(payload);
  });

  it('skips validation for unmatched param type', () => {
    const pipe = new ValidationPipe(schema, 'param');
    const payload = {} as any;

    expect(pipe.transform(payload, { type: 'body', data: '' })).toBe(payload);
  });

  it('throws bad request on invalid payload', () => {
    const pipe = new ValidationPipe(schema);
    expect(() => pipe.transform({} as any, { type: 'body', data: '' })).toThrow(
      BadRequestException,
    );
  });

  it('falls back to generic validation message when joi has no first error detail', () => {
    const objectSpy = jest.spyOn(Joi, 'object').mockReturnValue({
      validate: () => ({ error: { details: [] } }),
    } as any);
    const pipe = new ValidationPipe(schema);

    expect(() => pipe.transform({} as any, { type: 'body', data: '' })).toThrow(
      'Validation failed',
    );
    objectSpy.mockRestore();
  });
});
