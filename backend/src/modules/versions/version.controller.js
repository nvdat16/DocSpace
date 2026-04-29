const versionService = require('./version.service');

exports.listVersions = (req, res) => {
  const result = versionService.listVersions(req.params.documentId);
  return res.status(200).json({ success: true, data: result });
};
