const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password || '')).digest('hex');
}

function createToken(user) {
  const secret = process.env.JWT_SECRET || 'change-me';
  const payload = JSON.stringify({ sub: user.id, email: user.email, role: user.role || 'user' });
  return Buffer.from(`${payload}.${secret}`).toString('base64url');
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

exports.register = async (payload) => {
  const fullName = String(payload.fullName || '').trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!fullName) {
    const error = new Error('Full name is required');
    error.status = 400;
    throw error;
  }

  if (!email) {
    const error = new Error('Email is required');
    error.status = 400;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.status = 400;
    throw error;
  }

  const existing = await userRepository.findUserByEmail(email);
  if (existing) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  const created = await userRepository.createUser({
    fullName,
    email,
    passwordHash: hashPassword(password),
    avatarUrl: payload.avatarUrl || null,
    status: 'active',
  });

  const user = sanitizeUser(created);
  return {
    user,
    token: createToken(user),
  };
};

exports.login = async (payload) => {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  if (user.status !== 'active') {
    const error = new Error('User account is not active');
    error.status = 403;
    throw error;
  }

  if (hashPassword(password) !== user.passwordHash) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const safeUser = sanitizeUser(user);
  return {
    user: safeUser,
    token: createToken(safeUser),
  };
};
