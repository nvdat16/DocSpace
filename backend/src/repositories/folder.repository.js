const { pool } = require('../config/db');

function mapFolderRow(row) {
  return {
    id: Number(row.id),
    name: row.name,
    parentId: row.parent_id,
    parent:
      row.parent_id !== null && row.parent_id !== undefined
        ? {
            id: Number(row.parent_id),
            name: row.parent_name || '',
          }
        : null,
    ownerId: row.owner_id,
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
  };
}

async function listFolders(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.ownerId !== undefined && filters.ownerId !== null) {
    conditions.push('f.owner_id = ?');
    params.push(filters.ownerId);
  }

  if (filters.search) {
    conditions.push('f.name LIKE ?');
    params.push(`%${filters.search}%`);
  }

  if (filters.status) {
    conditions.push('f.status = ?');
    params.push(filters.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT f.id, f.name, f.parent_id, fp.name AS parent_name, f.owner_id, f.status, f.deleted_at, f.created_at, f.updated_at,
            u.full_name AS owner_full_name,
            u.email AS owner_email,
            u.avatar_url AS owner_avatar_url
     FROM folders f
     LEFT JOIN folders fp ON fp.id = f.parent_id
     LEFT JOIN users u ON u.id = f.owner_id
     ${whereClause}
     ORDER BY f.created_at DESC`,
    params,
  );

  return rows.map(mapFolderRow);
}

async function findFolderById(id) {
  const [rows] = await pool.query(
    `SELECT f.id, f.name, f.parent_id, fp.name AS parent_name, f.owner_id, f.status, f.deleted_at, f.created_at, f.updated_at,
            u.full_name AS owner_full_name,
            u.email AS owner_email,
            u.avatar_url AS owner_avatar_url
     FROM folders f
     LEFT JOIN folders fp ON fp.id = f.parent_id
     LEFT JOIN users u ON u.id = f.owner_id
     WHERE f.id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] ? mapFolderRow(rows[0]) : null;
}

async function createFolder(payload) {
  const [result] = await pool.query(
    `INSERT INTO folders (name, parent_id, owner_id, status, deleted_at)
     VALUES (?, ?, ?, 'active', NULL)`,
    [payload.name, payload.parentId || null, payload.ownerId || null],
  );

  return findFolderById(result.insertId);
}

async function updateFolder(id, payload, ownerId) {
  const existing = await findFolderById(id);
  if (!existing || (ownerId !== undefined && ownerId !== null && Number(existing.ownerId) !== Number(ownerId))) return null;

  const fields = [];
  const params = [];

  if (payload.name !== undefined) {
    fields.push('name = ?');
    params.push(payload.name);
  }

  if (payload.parentId !== undefined) {
    fields.push('parent_id = ?');
    params.push(payload.parentId);
  }

  if (payload.ownerId !== undefined) {
    fields.push('owner_id = ?');
    params.push(payload.ownerId);
  }

  if (payload.status !== undefined) {
    fields.push('status = ?');
    params.push(payload.status);
    if (payload.status === 'trash') {
      fields.push('deleted_at = COALESCE(deleted_at, NOW())');
    }
  }

  if (!fields.length) return findFolderById(id);

  params.push(id);
  await pool.query(`UPDATE folders SET ${fields.join(', ')} WHERE id = ?`, params);
  return findFolderById(id);
}

async function softDeleteFolder(id, ownerId) {
  const existing = await findFolderById(id);
  if (!existing || (ownerId !== undefined && ownerId !== null && Number(existing.ownerId) !== Number(ownerId))) return null;

  await pool.query("UPDATE folders SET status = 'trash', deleted_at = COALESCE(deleted_at, NOW()) WHERE id = ?", [id]);
  return findFolderById(id);
}

async function restoreFolder(id, ownerId) {
  const existing = await findFolderById(id);
  if (!existing || (ownerId !== undefined && ownerId !== null && Number(existing.ownerId) !== Number(ownerId))) return null;

  await pool.query("UPDATE folders SET status = 'active', deleted_at = NULL WHERE id = ?", [id]);
  return findFolderById(id);
}

async function permanentlyDeleteFolder(id, ownerId) {
  const existing = await findFolderById(id);
  if (!existing || (ownerId !== undefined && ownerId !== null && Number(existing.ownerId) !== Number(ownerId))) return false;

  const [result] = await pool.query('DELETE FROM folders WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function getFolderTree(ownerId) {
  const folders = await listFolders({ status: 'active', ownerId });
  const folderMap = new Map(folders.map((folder) => [folder.id, { ...folder, children: [] }]));
  const roots = [];

  for (const folder of folderMap.values()) {
    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId).children.push(folder);
    } else {
      roots.push(folder);
    }
  }

  return roots;
}

async function listTrash() {
  return listFolders({ status: 'trash' });
}

module.exports = {
  listFolders,
  findFolderById,
  createFolder,
  updateFolder,
  softDeleteFolder,
  restoreFolder,
  permanentlyDeleteFolder,
  getFolderTree,
  listTrash,
};
