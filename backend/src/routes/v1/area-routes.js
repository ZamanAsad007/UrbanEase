const express = require('express');
const { AreaController } = require('../../controllers');
const { authenticate, requireRole } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', AreaController.listAreas);
router.post('/', authenticate, requireRole('admin'), AreaController.createArea);
router.patch('/:id/assign-moderator', authenticate, requireRole('admin'), AreaController.assignModerator);

module.exports = router;
