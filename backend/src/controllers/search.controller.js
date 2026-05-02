const searchService = require('../services/search.service');

exports.search = (req, res, next) => {
  try {
    const result = searchService.search(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
