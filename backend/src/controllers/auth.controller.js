const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({ success: true, data: result, message: 'Registered successfully' });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({ success: true, data: result, message: 'Logged in successfully' });
  } catch (error) {
    return next(error);
  }
};
