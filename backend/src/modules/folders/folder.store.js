const { randomUUID } = require('crypto');

const folders = [];

function toFolder(folder) {
  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parentId || null,
    ownerId: folder.ownerId || null,
    status: folder.status || 'active',
    deletedAt: folder.deletedAt || null,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

function createFolder(payload) {
  const now = new Date().toISOString();
  const folder = toFolder({
    id: randomUUID(),
    name: payload.name,
    parentId: payload.parentId || null,
    ownerId: payload.ownerId || null,
    status: 'active',
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  folders.push(folder);
  return folder;
}

function findFolderById(id) {
  return folders.find((item) => item.id === id) || null;
}

function updateFolder(id, payload) {
  const folder = findFolderById(id);
  if (!folder) return null;

  Object.assign(folder, {
    name: payload.name ?? folder.name,
    parentId: payload.parentId ?? folder.parentId,
    ownerId: payload.ownerId ?? folder.ownerId,
    status: payload.status ?? folder.status,
    updatedAt: new Date().toISOString(),
  });

  return folder;
}

function softDeleteFolder(id) {
  const folder = findFolderById(id);
  if (!folder) return null;

  folder.status = 'trash';
  folder.deletedAt = new Date().toISOString();
  folder.updatedAt = new Date().toISOString();
  return folder;
}

function restoreFolder(id) {
  const folder = findFolderById(id);
  if (!folder) return null;

  folder.status = 'active';
  folder.deletedAt = null;
  folder.updatedAt = new Date().toISOString();
  return folder;
}

function permanentlyDeleteFolder(id) {
  const index = folders.findIndex((item) => item.id === id);
  if (index === -1) return false;
  folders.splice(index, 1);
  return true;
}

function listFolders(query = {}) {
  const { search = '', ownerId, status = 'active' } = query;
  const searchTerm = String(search).trim().toLowerCase();

  return folders.filter((folder) => {
    const matchesSearch = !searchTerm || folder.name.toLowerCase().includes(searchTerm);
    const matchesOwner = ownerId === undefined ? true : String(folder.ownerId || '') === String(ownerId || '');
    const matchesStatus = !status || folder.status === status;
    return matchesSearch && matchesOwner && matchesStatus;
  });
}

function getFolderTree() {
  const activeFolders = folders.filter((folder) => folder.status === 'active');
  return activeFolders.map((folder) => ({
    ...folder,
    children: activeFolders.filter((child) => child.parentId === folder.id),
  }));
}

function listTrash() {
  return folders.filter((folder) => folder.status === 'trash');
}

module.exports = {
  createFolder,
  findFolderById,
  updateFolder,
  softDeleteFolder,
  restoreFolder,
  permanentlyDeleteFolder,
  listFolders,
  getFolderTree,
  listTrash,
};
