const express = require('express');
const { AreaController } = require('../../controllers');

const router = express.Router();

router.get('/', AreaController.listAreas);
router.post('/', AreaController.createArea);
router.patch('/:id/assign-moderator', AreaController.assignModerator);

module.exports = router;
