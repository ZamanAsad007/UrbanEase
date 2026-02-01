const express = require('express');
const userRoutes = require('./user-routes');
const reportRoutes = require('./report-routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
