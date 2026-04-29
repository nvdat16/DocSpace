const shareService = require('./share.service');

exports.createShareLink = (req, res) => {
  const result = shareService.createShareLink(req.body);
  return res.status(201).json({ success: true, data: result });
};
