const documentService = require('../services/document.service');

exports.listDocuments = async (req, res, next) => {
  try {
    const result = await documentService.listDocuments(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.getDocumentById = async (req, res, next) => {
  try {
    const result = await documentService.getDocumentById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.createDocument = async (req, res, next) => {
  try {
    const result = await documentService.createDocument(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
    const result = await documentService.updateDocument(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const result = await documentService.softDeleteDocument(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.status(200).json({ success: true, data: result, message: 'Document moved to trash' });
  } catch (error) {
    return next(error);
  }
};

exports.restoreDocument = async (req, res, next) => {
  try {
    const result = await documentService.restoreDocument(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.status(200).json({ success: true, data: result, message: 'Document restored' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteDocumentForever = async (req, res, next) => {
  try {
    const deleted = await documentService.permanentlyDeleteDocument(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.status(200).json({ success: true, message: 'Document permanently deleted' });
  } catch (error) {
    return next(error);
  }
};
