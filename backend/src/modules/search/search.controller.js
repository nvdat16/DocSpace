const searchService = require('./search.service');

exports.search = (req, res) => {
  const result = searchService.search(req.query);
  return res.status(200).json({ success: true, data: result });
};
