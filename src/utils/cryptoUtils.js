const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// Secret should be placed in a secure vault - this is just for demonstration
const key = crypto.scryptSync('default_secret', 'salt', 32);
// IV values can be used in the prod setting and store it in the vault
const iv = Buffer.alloc(16, 0);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
