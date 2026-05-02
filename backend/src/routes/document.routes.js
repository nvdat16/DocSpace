const express = require('express');
const documentController = require('../controllers/document.controller');

const router = express.Router();

router.get('/', documentController.listDocuments);
router.get('/trash', documentController.listDocuments);
router.get('/:id', documentController.getDocumentById);
router.post('/', documentController.createDocument);
router.patch('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.post('/:id/restore', documentController.restoreDocument);
router.delete('/:id/permanent', documentController.deleteDocumentForever);

module.exports = router;
