const userService = require('../services/user.service');

exports.getProfile = (req, res, next) => {
  try {
    const result = userService.getProfile(req.user);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.updateProfile = (req, res, next) => {
  try {
    const result = userService.updateProfile(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
