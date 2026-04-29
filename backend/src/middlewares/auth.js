module.exports = (req, res, next) => {
  req.user = req.user || null;
  next();
};
