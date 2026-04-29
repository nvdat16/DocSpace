const express = require('express');
const trashController = require('./trash.controller');

const router = express.Router();

router.get('/', trashController.listTrash);

module.exports = router;
