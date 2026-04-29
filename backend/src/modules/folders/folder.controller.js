const folderService = require('./folder.service');

exports.listFolders = (req, res) => {
  const result = folderService.listFolders(req.query);
  return res.status(200).json({ success: true, data: result });
};

exports.createFolder = (req, res) => {
  const result = folderService.createFolder(req.body);
  return res.status(201).json({ success: true, data: result });
};
