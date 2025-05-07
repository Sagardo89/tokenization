const Fastify = require('fastify');
const tokenRoutes = require('../src/routes/tokenRoutes');

describe('Token Routes', () => {
  let fastify;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.register(tokenRoutes);
    await fastify.ready();
  });

  afterAll(() => fastify.close());

  it('should return tokens for /tokenize', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/tokenize',
      payload: ['4444333322221111']
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
  });

  it('should return account numbers for /detokenize', async () => {
    // First, tokenize to get a valid token
    const tokenizeRes = await fastify.inject({
      method: 'POST',
      url: '/tokenize',
      payload: ['1111222233330000']
    });
    const token = JSON.parse(tokenizeRes.body)[0];

    // Now detokenize
    const detokenizeRes = await fastify.inject({
      method: 'POST',
      url: '/detokenize',
      payload: [token]
    });

    expect(detokenizeRes.statusCode).toBe(200);
    const body = JSON.parse(detokenizeRes.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toBe('1111222233330000');
  });

  it('should return 400 for non-array input to /tokenize', async () => {
    const res = await fastify.inject({
      method: 'POST',
      url: '/tokenize',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: 'not-an-array'
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for non-array input to /detokenize', async () => {
    const res = await fastify.inject({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/detokenize',
      payload: 'invalid-input'
    });

    expect(res.statusCode).toBe(400);
  });
});
