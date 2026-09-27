const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = generateToken;
