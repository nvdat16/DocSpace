const trashService = require('./trash.service');

exports.listTrash = (req, res) => {
  const result = trashService.listTrash(req.query);
  return res.status(200).json({ success: true, data: result });
};
