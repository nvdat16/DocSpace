const express = require('express');
const documentController = require('./document.controller');

const router = express.Router();

router.get('/', documentController.listDocuments);
router.post('/', documentController.createDocument);

module.exports = router;
