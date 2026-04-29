const express = require('express');
const folderController = require('./folder.controller');

const router = express.Router();

router.get('/', folderController.listFolders);
router.post('/', folderController.createFolder);

module.exports = router;
