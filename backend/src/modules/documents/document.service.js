const documentRepository = require('../../repositories/document.repository');

exports.listDocuments = (query) => documentRepository.listDocuments(query);

exports.getDocumentById = (id) => documentRepository.findDocumentById(id);

exports.createDocument = async (payload) => {
  if (!payload || !payload.title) {
    const error = new Error('Document title is required');
    error.status = 400;
    throw error;
  }

  return documentRepository.createDocument(payload);
};

exports.updateDocument = (id, payload) => documentRepository.updateDocument(id, payload);

exports.softDeleteDocument = (id) => documentRepository.softDeleteDocument(id);

exports.restoreDocument = (id) => documentRepository.restoreDocument(id);

exports.permanentlyDeleteDocument = (id) => documentRepository.permanentlyDeleteDocument(id);

exports.listTrash = () => documentRepository.listTrash();
