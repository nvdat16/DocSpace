const trashService = require('../services/trash.service');

exports.listTrash = async (req, res, next) => {
  try {
    const result = await trashService.listTrash();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
