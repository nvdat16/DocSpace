const userService = require('./user.service');

exports.getProfile = (req, res) => {
  const result = userService.getProfile(req.user);
  return res.status(200).json({ success: true, data: result });
};

exports.updateProfile = (req, res) => {
  const result = userService.updateProfile(req.body);
  return res.status(200).json({ success: true, data: result });
};
