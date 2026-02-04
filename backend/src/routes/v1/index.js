const express = require('express');
const authRoutes = require('./auth-routes');
const userRoutes = require('./user-routes');
const areaRoutes = require('./area-routes');
const postRoutes = require('./post-routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/areas', areaRoutes);
router.use('/posts', postRoutes);

module.exports = router;
