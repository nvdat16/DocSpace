const folderService = require('./folder.service');

exports.listFolders = async (req, res, next) => {
  try {
    const result = await folderService.listFolders(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.getFolderById = async (req, res, next) => {
  try {
    const result = await folderService.getFolderById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.getFolderTree = async (req, res, next) => {
  try {
    const result = await folderService.getFolderTree();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.createFolder = async (req, res, next) => {
  try {
    const result = await folderService.createFolder(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.updateFolder = async (req, res, next) => {
  try {
    const result = await folderService.updateFolder(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.deleteFolder = async (req, res, next) => {
  try {
    const result = await folderService.softDeleteFolder(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    return res.status(200).json({ success: true, data: result, message: 'Folder moved to trash' });
  } catch (error) {
    return next(error);
  }
};

exports.restoreFolder = async (req, res, next) => {
  try {
    const result = await folderService.restoreFolder(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    return res.status(200).json({ success: true, data: result, message: 'Folder restored' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteFolderForever = async (req, res, next) => {
  try {
    const deleted = await folderService.permanentlyDeleteFolder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    return res.status(200).json({ success: true, message: 'Folder permanently deleted' });
  } catch (error) {
    return next(error);
  }
};
