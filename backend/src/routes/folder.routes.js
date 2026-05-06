const express = require('express');
const folderController = require('../controllers/folder.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

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
