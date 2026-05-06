const documentRepository = require('../repositories/document.repository');

exports.listDocuments = (query, ownerId) => documentRepository.listDocuments({ ...query, ownerId });

exports.getDocumentById = (id, ownerId) => documentRepository.findDocumentById(id, ownerId);

exports.createDocument = async (payload, ownerId) => {
  if (!payload || !payload.title) {
    const error = new Error('Document title is required');
    error.status = 400;
    throw error;
  }

  return documentRepository.createDocument({ ...payload, ownerId });
};

exports.updateDocument = (id, payload, ownerId) => documentRepository.updateDocument(id, payload, ownerId);

exports.softDeleteDocument = (id, ownerId) => documentRepository.softDeleteDocument(id, ownerId);

exports.restoreDocument = (id, ownerId) => documentRepository.restoreDocument(id, ownerId);

exports.permanentlyDeleteDocument = (id, ownerId) => documentRepository.permanentlyDeleteDocument(id, ownerId);

exports.listTrash = (ownerId) => documentRepository.listTrash(ownerId);
