const authService = require('./auth.service');

exports.register = (req, res) => {
  const result = authService.register(req.body);
  return res.status(201).json({ success: true, data: result });
};

exports.login = (req, res) => {
  const result = authService.login(req.body);
  return res.status(200).json({ success: true, data: result });
};
