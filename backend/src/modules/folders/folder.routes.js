const express = require('express');
const folderController = require('./folder.controller');

const router = express.Router();

router.get('/', folderController.listFolders);
router.get('/tree', folderController.getFolderTree);
router.get('/trash', folderController.listFolders);
router.get('/:id', folderController.getFolderById);
router.post('/', folderController.createFolder);
router.patch('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);
router.post('/:id/restore', folderController.restoreFolder);
router.delete('/:id/permanent', folderController.deleteFolderForever);

module.exports = router;
