const { randomUUID } = require('crypto');

const documents = [];

function toDocument(document) {
  return {
    id: document.id,
    title: document.title,
    description: document.description || '',
    fileName: document.fileName || '',
    mimeType: document.mimeType || '',
    size: document.size || 0,
    tags: Array.isArray(document.tags) ? document.tags : [],
    ownerId: document.ownerId || null,
    folderId: document.folderId || null,
    status: document.status || 'active',
    deletedAt: document.deletedAt || null,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

function createDocument(payload) {
  const now = new Date().toISOString();
  const document = toDocument({
    id: randomUUID(),
    title: payload.title,
    description: payload.description,
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    size: payload.size,
    tags: payload.tags,
    ownerId: payload.ownerId,
    folderId: payload.folderId || null,
    status: 'active',
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  documents.push(document);
  return document;
}

function findDocumentById(id) {
  return documents.find((item) => item.id === id) || null;
}

function updateDocument(id, payload) {
  const document = findDocumentById(id);
  if (!document) return null;

  Object.assign(document, {
    title: payload.title ?? document.title,
    description: payload.description ?? document.description,
    fileName: payload.fileName ?? document.fileName,
    mimeType: payload.mimeType ?? document.mimeType,
    size: payload.size ?? document.size,
    tags: payload.tags ?? document.tags,
    folderId: payload.folderId ?? document.folderId,
    ownerId: payload.ownerId ?? document.ownerId,
    status: payload.status ?? document.status,
    updatedAt: new Date().toISOString(),
  });

  return document;
}

function softDeleteDocument(id) {
  const document = findDocumentById(id);
  if (!document) return null;

  document.status = 'trash';
  document.deletedAt = new Date().toISOString();
  document.updatedAt = new Date().toISOString();
  return document;
}

function restoreDocument(id) {
  const document = findDocumentById(id);
  if (!document) return null;

  document.status = 'active';
  document.deletedAt = null;
  document.updatedAt = new Date().toISOString();
  return document;
}

function permanentlyDeleteDocument(id) {
  const index = documents.findIndex((item) => item.id === id);
  if (index === -1) return false;
  documents.splice(index, 1);
  return true;
}

function listDocuments(query = {}) {
  const {
    search = '',
    tag = '',
    folderId,
    ownerId,
    status = 'active',
  } = query;

  const searchTerm = String(search).trim().toLowerCase();
  const tagTerm = String(tag).trim().toLowerCase();

  return documents.filter((document) => {
    const matchesSearch = !searchTerm || [document.title, document.description, document.fileName]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchTerm));

    const matchesTag = !tagTerm || document.tags.some((item) => String(item).toLowerCase() === tagTerm);
    const matchesFolder = folderId === undefined ? true : String(document.folderId || '') === String(folderId || '');
    const matchesOwner = ownerId === undefined ? true : String(document.ownerId || '') === String(ownerId || '');
    const matchesStatus = !status || document.status === status;

    return matchesSearch && matchesTag && matchesFolder && matchesOwner && matchesStatus;
  });
}

function listTrash() {
  return documents.filter((document) => document.status === 'trash');
}

module.exports = {
  createDocument,
  findDocumentById,
  updateDocument,
  softDeleteDocument,
  restoreDocument,
  permanentlyDeleteDocument,
  listDocuments,
  listTrash,
};
