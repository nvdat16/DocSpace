const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const documentRoutes = require('../modules/documents/document.routes');
const folderRoutes = require('../modules/folders/folder.routes');
const searchRoutes = require('../modules/search/search.routes');
const shareRoutes = require('../modules/shares/share.routes');
const versionRoutes = require('../modules/versions/version.routes');
const trashRoutes = require('../modules/trash/trash.routes');

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
