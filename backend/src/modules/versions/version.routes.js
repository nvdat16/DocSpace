const express = require('express');
const versionController = require('./version.controller');

const router = express.Router();

router.get('/documents/:documentId', versionController.listVersions);

module.exports = router;
