const express = require('express');
const trashController = require('../controllers/trash.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', trashController.listTrash);

module.exports = router;
