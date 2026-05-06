const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);

module.exports = router;
