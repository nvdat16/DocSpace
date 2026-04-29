const documentService = require('./document.service');

exports.listDocuments = (req, res) => {
  const result = documentService.listDocuments(req.query);
  return res.status(200).json({ success: true, data: result });
};

exports.createDocument = (req, res) => {
  const result = documentService.createDocument(req.body);
  return res.status(201).json({ success: true, data: result });
};
