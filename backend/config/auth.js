const crypto = require('crypto');

const isProduction = process.env.NODE_ENV === 'production';
let JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (isProduction) {
    throw new Error('JWT_SECRET must be set in production.');
  }
  JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.warn('[auth] JWT_SECRET is not set. Using an ephemeral in-memory secret for this local run.');
}

module.exports = { JWT_SECRET };
