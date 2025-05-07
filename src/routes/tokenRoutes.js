const tokenizationController = require('../controllers/tokenizationController');

async function tokenRoutes(fastify, opts) {
  fastify.post('/tokenize', {
    schema: {
      body: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }, tokenizationController.tokenize);

  fastify.post('/detokenize', {
    schema: {
      body: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }, tokenizationController.detokenize);
}

module.exports = tokenRoutes;
