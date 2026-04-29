module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};
