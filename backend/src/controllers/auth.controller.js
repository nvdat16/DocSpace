const authService = require('../services/auth.service');

exports.register = (req, res, next) => {
  try {
    const result = authService.register(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.login = (req, res, next) => {
  try {
    const result = authService.login(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
