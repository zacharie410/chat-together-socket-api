// config.js
const crypto = require('crypto');

module.exports = {
  secretKey: crypto.randomBytes(64).toString('hex'),
};
