const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex');

if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET is not set. Using an ephemeral in-memory secret for this run.');
}

module.exports = { JWT_SECRET };
