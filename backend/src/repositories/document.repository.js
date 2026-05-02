const { pool } = require('../config/db');

function mapDocumentRow(row) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description || '',
    fileName: row.file_name || '',
    mimeType: row.mime_type || '',
    size: Number(row.size || 0),
    tags: row.tags ? JSON.parse(row.tags) : [],
    ownerId: row.owner_id,
    folderId: row.folder_id,
    status: row.status,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listDocuments(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.search) {
    conditions.push('(title LIKE ? OR description LIKE ? OR file_name LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  if (filters.tag) {
    conditions.push('JSON_CONTAINS(tags, JSON_QUOTE(?))');
    params.push(filters.tag);
  }

  if (filters.folderId !== undefined) {
    conditions.push('folder_id = ?');
    params.push(filters.folderId);
  }

  if (filters.ownerId !== undefined) {
    conditions.push('owner_id = ?');
    params.push(filters.ownerId);
  }

  if (filters.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT id, title, description, file_name, mime_type, size, tags, owner_id, folder_id, status, deleted_at, created_at, updated_at
     FROM documents
     ${whereClause}
     ORDER BY created_at DESC`,
    params,
  );

  return rows.map(mapDocumentRow);
}

async function findDocumentById(id) {
  const [rows] = await pool.query(
    `SELECT id, title, description, file_name, mime_type, size, tags, owner_id, folder_id, status, deleted_at, created_at, updated_at
     FROM documents
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] ? mapDocumentRow(rows[0]) : null;
}

async function createDocument(payload) {
  const tags = Array.isArray(payload.tags) ? JSON.stringify(payload.tags) : JSON.stringify([]);
  const [result] = await pool.query(
    `INSERT INTO documents (title, description, file_name, mime_type, size, tags, owner_id, folder_id, status, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NULL)`,
    [
      payload.title,
      payload.description || null,
      payload.fileName || null,
      payload.mimeType || null,
      payload.size || 0,
      tags,
      payload.ownerId || null,
      payload.folderId || null,
    ],
  );

  return findDocumentById(result.insertId);
}

async function updateDocument(id, payload) {
  const fields = [];
  const params = [];

  if (payload.title !== undefined) {
    fields.push('title = ?');
    params.push(payload.title);
  }

  if (payload.description !== undefined) {
    fields.push('description = ?');
    params.push(payload.description);
  }

  if (payload.fileName !== undefined) {
    fields.push('file_name = ?');
    params.push(payload.fileName);
  }

  if (payload.mimeType !== undefined) {
    fields.push('mime_type = ?');
    params.push(payload.mimeType);
  }

  if (payload.size !== undefined) {
    fields.push('size = ?');
    params.push(payload.size);
  }

  if (payload.tags !== undefined) {
    fields.push('tags = ?');
    params.push(JSON.stringify(payload.tags));
  }

  if (payload.ownerId !== undefined) {
    fields.push('owner_id = ?');
    params.push(payload.ownerId);
  }

  if (payload.folderId !== undefined) {
    fields.push('folder_id = ?');
    params.push(payload.folderId);
  }

  if (payload.status !== undefined) {
    fields.push('status = ?');
    params.push(payload.status);
    if (payload.status === 'trash') {
      fields.push('deleted_at = COALESCE(deleted_at, NOW())');
    }
  }

  if (!fields.length) return findDocumentById(id);

  params.push(id);
  await pool.query(`UPDATE documents SET ${fields.join(', ')} WHERE id = ?`, params);
  return findDocumentById(id);
}

async function softDeleteDocument(id) {
  await pool.query("UPDATE documents SET status = 'trash', deleted_at = COALESCE(deleted_at, NOW()) WHERE id = ?", [id]);
  return findDocumentById(id);
}

async function restoreDocument(id) {
  await pool.query("UPDATE documents SET status = 'active', deleted_at = NULL WHERE id = ?", [id]);
  return findDocumentById(id);
}

async function permanentlyDeleteDocument(id) {
  const [result] = await pool.query('DELETE FROM documents WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function listTrash() {
  return listDocuments({ status: 'trash' });
}

module.exports = {
  listDocuments,
  findDocumentById,
  createDocument,
  updateDocument,
  softDeleteDocument,
  restoreDocument,
  permanentlyDeleteDocument,
  listTrash,
};
