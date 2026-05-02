const shareService = require('../services/share.service');

exports.createShareLink = (req, res, next) => {
  try {
    const result = shareService.createShareLink(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
