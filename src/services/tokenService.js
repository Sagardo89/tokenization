const { v4: uuidv4 } = require('uuid');
const Loki = require('lokijs');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

const db = new Loki('tokens.db');
const tokens = db.addCollection('tokens', {
    autoload: true,
    autosave: true 
});

function tokenizeValues(values) {
  return values.map(value => {
    // store the encrypted values in the db for security
    const encrypted = encrypt(value);
    const existing = tokens.findOne({ encrypted });
    if (existing) return { plainNumber: value, token: existing.token };

    const token = uuidv4();
    tokens.insert({ token, encrypted });
    return { plainNumber: value, token };
  });
}

function detokenizeValues(tokenList) {
  return tokenList.map(token => {
    const record = tokens.findOne({ token });
    const plainNumber = record ? decrypt(record.encrypted) : null;
    return { token, plainNumber };
  });
}

module.exports = { tokenizeValues, detokenizeValues };
