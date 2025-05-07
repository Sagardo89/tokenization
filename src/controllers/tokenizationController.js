const { tokenizeValues, detokenizeValues } = require('../../src/services/tokenService');

async function tokenize(req, reply) {
  const values = req.body;
  if (!Array.isArray(values)) {
    return reply.code(400).send({ error: 'Values must be an array of strings' });
  }
  const result = tokenizeValues(values);
  const tokens = result.map(item => item.token);
  return tokens;
}

async function detokenize(req, reply) {
  const tokens = req.body;
  if (!Array.isArray(tokens)) {
    return reply.code(400).send({ error: 'Tokens must be an array of strings' });
  }
  const result = detokenizeValues(tokens);
  const accountOrCardValues = result.map(item => item.plainNumber);
  return accountOrCardValues;
}

module.exports = { tokenize, detokenize };

