const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);

module.exports = router;
