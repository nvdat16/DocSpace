const express = require('express');
const trashController = require('../controllers/trash.controller');

const router = express.Router();

router.get('/', trashController.listTrash);

module.exports = router;
