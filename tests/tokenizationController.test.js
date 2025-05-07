const Fastify = require('fastify');
const { tokenize, detokenize } = require('../src/controllers/tokenizationController');
const { tokenizeValues, detokenizeValues } = require('../src/services/tokenService');

jest.mock('../src/services/tokenService');

describe('Tokenization Controller', () => {
  const fastify = Fastify({ logger: true });

  beforeAll(async () => {
    fastify.post('/tokenize', tokenize);
    fastify.post('/detokenize', detokenize);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  test('POST /tokenize - should return tokens for valid input', async () => {
    const mockValues = ['1234567890', '9876543210'];
    const mockResponse = mockValues.map(value => ({ plainNumber: value, token: 'mockToken' }));
    tokenizeValues.mockReturnValue(mockResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/tokenize',
      headers: { 'Content-Type': 'application/json' },
      payload: mockValues
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual(['mockToken', 'mockToken']);
    expect(tokenizeValues).toHaveBeenCalledWith(mockValues);
  });

  test('POST /tokenize - should return 400 for non-array input', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/tokenize',
      headers: { 'Content-Type': 'application/json' },
      payload: '1234567890'
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

  test('POST /detokenize - should return account numbers from tokens', async () => {
    const mockTokens = ['mockToken'];
    const mockResponse = [{ token: 'mockToken', plainNumber: '1234567890' }];
    detokenizeValues.mockReturnValue(mockResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/detokenize',
      headers: { 'Content-Type': 'application/json' },
      payload: mockTokens
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual(['1234567890']);
    expect(detokenizeValues).toHaveBeenCalledWith(mockTokens);
  });

  test('POST /detokenize - should return null for unknown token', async () => {
    const mockTokens = ['unknownToken'];
    const mockResponse = [{ token: 'unknownToken', plainNumber: null }];
    detokenizeValues.mockReturnValue(mockResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/detokenize',
      headers: { 'Content-Type': 'application/json' },
      payload: mockTokens
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual([null]);
  });

  test('POST /detokenize - should return 400 for invalid input type', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/detokenize',
      headers: { 'Content-Type': 'application/json' },
      payload: { token: 'abc' }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });
});
