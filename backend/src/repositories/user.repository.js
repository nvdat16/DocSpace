const { pool } = require('../config/db');

function mapUserRow(row) {
  if (!row) return null;

  return {
    id: Number(row.id),
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    avatarUrl: row.avatar_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, full_name, email, password_hash, avatar_url, status, created_at, updated_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email],
  );

  return mapUserRow(rows[0]);
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, full_name, email, password_hash, avatar_url, status, created_at, updated_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return mapUserRow(rows[0]);
}

async function createUser(payload) {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, avatar_url, status)
     VALUES (?, ?, ?, ?, ?)` ,
    [
      payload.fullName,
      payload.email,
      payload.passwordHash,
      payload.avatarUrl || null,
      payload.status || 'active',
    ],
  );

  return findUserById(result.insertId);
}

async function updateUserById(id, payload) {
  const fields = [];
  const params = [];

  if (payload.fullName !== undefined) {
    fields.push('full_name = ?');
    params.push(payload.fullName);
  }

  if (payload.email !== undefined) {
    fields.push('email = ?');
    params.push(payload.email);
  }

  if (payload.passwordHash !== undefined) {
    fields.push('password_hash = ?');
    params.push(payload.passwordHash);
  }

  if (payload.avatarUrl !== undefined) {
    fields.push('avatar_url = ?');
    params.push(payload.avatarUrl);
  }

  if (payload.status !== undefined) {
    fields.push('status = ?');
    params.push(payload.status);
  }

  if (!fields.length) return findUserById(id);

  params.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  return findUserById(id);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
};
