const versionService = require('../services/version.service');

exports.listVersions = (req, res, next) => {
  try {
    const result = versionService.listVersions(req.params.documentId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
