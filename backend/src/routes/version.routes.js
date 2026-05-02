const express = require('express');
const versionController = require('../controllers/version.controller');

const router = express.Router();

router.get('/documents/:documentId', versionController.listVersions);

module.exports = router;
