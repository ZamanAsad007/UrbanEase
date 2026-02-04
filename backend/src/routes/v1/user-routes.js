const express = require('express');
const { UserController } = require('../../controllers');

const router = express.Router();

router.post('/register', UserController.registerUser);
router.get('/pending', UserController.listPendingUsers);
router.patch('/:id/approve', UserController.approveUser);
router.get('/:id', UserController.getUser);

module.exports = router;
