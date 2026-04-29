module.exports = (...allowedRoles) => (req, res, next) => {
  req.allowedRoles = allowedRoles;
  next();
};
