const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const documentRoutes = require('./document.routes');
const folderRoutes = require('./folder.routes');
const searchRoutes = require('./search.routes');
const shareRoutes = require('./share.routes');
const versionRoutes = require('./version.routes');
const trashRoutes = require('./trash.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/folders', folderRoutes);
router.use('/search', searchRoutes);
router.use('/shares', shareRoutes);
router.use('/versions', versionRoutes);
router.use('/trash', trashRoutes);

module.exports = router;
