const crypto = require('crypto');

function parseToken(token) {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const separatorIndex = decoded.lastIndexOf('.');
    if (separatorIndex === -1) return null;

    const payloadPart = decoded.slice(0, separatorIndex);
    const secretPart = decoded.slice(separatorIndex + 1);
    const expectedSecret = process.env.JWT_SECRET || 'change-me';

    if (secretPart !== expectedSecret) return null;

    const payload = JSON.parse(payloadPart);
    return {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role || 'user',
    };
  } catch (error) {
    return null;
  }
}

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  req.user = parseToken(token);
  next();
};

module.exports.parseToken = parseToken;
