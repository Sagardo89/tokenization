const { tokenizeValues, detokenizeValues } = require('../src/services/tokenService');
const { decrypt } = require('../src/utils/cryptoUtils');

describe('Tokenization Service', () => {
  const inputValues = ['1234567890', '9876543210'];
  let tokenizedResults = [];

  test('should tokenize each input value uniquely', () => {
    tokenizedResults = tokenizeValues(inputValues);
    expect(tokenizedResults).toHaveLength(inputValues.length);

    tokenizedResults.forEach((item, idx) => {
      expect(item.token).toBeDefined();
      expect(typeof item.token).toBe('string');
      expect(item.plainNumber).toBe(inputValues[idx]);
    });

    // Tokens must be unique for different inputs
    const tokens = tokenizedResults.map(item => item.token);
    const uniqueTokens = [...new Set(tokens)];
    expect(uniqueTokens).toHaveLength(tokens.length);
  });

  test('should return same token for duplicate inputs', () => {
    const result = tokenizeValues([inputValues[0]]);
    expect(result[0].token).toBe(tokenizedResults[0].token);
  });

  test('should detokenize tokens back to original values', () => {
    const tokens = tokenizedResults.map(r => r.token);
    const detokenized = detokenizeValues(tokens);

    expect(detokenized).toHaveLength(tokens.length);

    detokenized.forEach((item, idx) => {
      expect(item.token).toBe(tokens[idx]);
      expect(item.plainNumber).toBe(inputValues[idx]);
    });
  });

  test('should return null for unknown tokens', () => {
    const result = detokenizeValues(['non-existent-token']);
    expect(result).toHaveLength(1);
    expect(result[0].token).toBe('non-existent-token');
    expect(result[0].plainNumber).toBeNull();
  });

  test('should handle empty input arrays', () => {
    expect(tokenizeValues([])).toEqual([]);
    expect(detokenizeValues([])).toEqual([]);
  });
});
