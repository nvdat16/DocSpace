const { pool } = require('../config/db');

function safeJsonParse(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;

  if (Array.isArray(value)) return value;

  if (typeof value !== 'string') return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function mapDocumentRow(row) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description || '',
    fileName: row.file_name || '',
    mimeType: row.mime_type || '',
    size: Number(row.size || 0),
    tags: safeJsonParse(row.tags, []),
    ownerId: row.owner_id,
    folderId: row.folder_id,
    folderName: row.folder_name || '',
    folder: row.folder_id
      ? {
          id: Number(row.folder_id),
          name: row.folder_name || '',
          parentId: row.folder_parent_id,
          parentName: row.folder_parent_name || '',
        }
      : null,
    owner:
      row.owner_id !== null && row.owner_id !== undefined
        ? {
            id: Number(row.owner_id),
            fullName: row.owner_full_name || '',
            email: row.owner_email || '',
            avatarUrl: row.owner_avatar_url || '',
          }
        : null,
    status: row.status,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    fileUrl: row.file_name ? `/uploads/${row.file_name}` : '',
  };
}

async function listDocuments(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.ownerId !== undefined && filters.ownerId !== null) {
    conditions.push('d.owner_id = ?');
    params.push(filters.ownerId);
  }

  if (filters.search) {
    conditions.push('(d.title LIKE ? OR d.description LIKE ? OR d.file_name LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  if (filters.tag) {
    conditions.push('JSON_CONTAINS(d.tags, JSON_QUOTE(?))');
    params.push(filters.tag);
  }

  if (filters.folderId !== undefined) {
    conditions.push('d.folder_id = ?');
    params.push(filters.folderId);
  }

  if (filters.ownerId !== undefined) {
    conditions.push('d.owner_id = ?');
    params.push(filters.ownerId);
  }

  if (filters.status) {
    conditions.push('d.status = ?');
    params.push(filters.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT d.id,
            d.title,
            d.description,
            d.file_name,
            d.mime_type,
            d.size,
            d.tags,
            d.owner_id,
            u.full_name AS owner_full_name,
            u.email AS owner_email,
            u.avatar_url AS owner_avatar_url,
            d.folder_id,
            f.name AS folder_name,
                 f.parent_id AS folder_parent_id,
                 fp.name AS folder_parent_name,
            d.status,
            d.deleted_at,
            d.created_at,
            d.updated_at
     FROM documents d
     LEFT JOIN folders f ON f.id = d.folder_id
               LEFT JOIN folders fp ON fp.id = f.parent_id
     LEFT JOIN users u ON u.id = d.owner_id
     ${whereClause}
     ORDER BY d.created_at DESC`,
    params,
  );

  return rows.map(mapDocumentRow);
}

async function findDocumentById(id, ownerId) {
  const ownerClause = ownerId !== undefined && ownerId !== null ? 'AND d.owner_id = ?' : '';
  const params = ownerClause ? [id, ownerId] : [id];
  const [rows] = await pool.query(
    `SELECT d.id,
            d.title,
            d.description,
            d.file_name,
            d.mime_type,
            d.size,
            d.tags,
            d.owner_id,
            u.full_name AS owner_full_name,
            u.email AS owner_email,
            u.avatar_url AS owner_avatar_url,
            d.folder_id,
            f.name AS folder_name,
                 f.parent_id AS folder_parent_id,
                 fp.name AS folder_parent_name,
            d.status,
            d.deleted_at,
            d.created_at,
            d.updated_at
     FROM documents d
     LEFT JOIN folders f ON f.id = d.folder_id
               LEFT JOIN folders fp ON fp.id = f.parent_id
     LEFT JOIN users u ON u.id = d.owner_id
     WHERE d.id = ?
     ${ownerClause}
     LIMIT 1`,
    params,
  );

  return rows[0] ? mapDocumentRow(rows[0]) : null;
}

async function createDocument(payload) {
  const tags = JSON.stringify(safeJsonParse(payload.tags, []));
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

  return findDocumentById(result.insertId, payload.ownerId || null);
}

async function updateDocument(id, payload, ownerId) {
  const existing = await findDocumentById(id, ownerId);
  if (!existing) return null;

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

  if (!fields.length) return findDocumentById(id, ownerId);

  params.push(id);
  await pool.query(`UPDATE documents SET ${fields.join(', ')} WHERE id = ?`, params);
  return findDocumentById(id, ownerId);
}

async function softDeleteDocument(id, ownerId) {
  const existing = await findDocumentById(id, ownerId);
  if (!existing) return null;

  await pool.query("UPDATE documents SET status = 'trash', deleted_at = COALESCE(deleted_at, NOW()) WHERE id = ?", [id]);
  return findDocumentById(id, ownerId);
}

async function restoreDocument(id, ownerId) {
  const existing = await findDocumentById(id, ownerId);
  if (!existing) return null;

  await pool.query("UPDATE documents SET status = 'active', deleted_at = NULL WHERE id = ?", [id]);
  return findDocumentById(id, ownerId);
}

async function permanentlyDeleteDocument(id, ownerId) {
  const existing = await findDocumentById(id, ownerId);
  if (!existing) return false;

  const [result] = await pool.query('DELETE FROM documents WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function listTrash(ownerId) {
  return listDocuments({ status: 'trash', ownerId });
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
