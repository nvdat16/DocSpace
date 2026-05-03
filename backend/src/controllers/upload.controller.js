const documentService = require('../services/document.service');

exports.uploadDocument = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }

    const payload = {
      title: req.body.title || file.originalname,
      description: req.body.description || '',
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      ownerId: req.body.ownerId || null,
      folderId: req.body.folderId || null,
    };

    const result = await documentService.createDocument(payload);
    return res.status(201).json({ success: true, data: result, message: 'Document uploaded' });
  } catch (error) {
    return next(error);
  }
};
