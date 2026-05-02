const express = require('express');
const shareController = require('../controllers/share.controller');

const router = express.Router();

router.post('/', shareController.createShareLink);

module.exports = router;
