const express = require('express');
const { UserController } = require('../../controllers');
const { authenticate, requireRole } = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.post('/register', UserController.registerUser);

router.get('/me', authenticate, UserController.getMe);
router.patch('/me/name', authenticate, UserController.updateMyName);
router.patch('/me/password', authenticate, UserController.changeMyPassword);
router.patch('/me/avatar', authenticate, upload.single('image'), UserController.updateMyAvatar);

router.post('/moderators', authenticate, requireRole('admin'), UserController.createModerator);
router.get('/pending', authenticate, requireRole('admin'), UserController.listPendingUsers);
router.patch('/:id/approve', authenticate, requireRole('admin'), UserController.approveUser);
router.patch('/:id/reject', authenticate, requireRole('admin'), UserController.rejectUser);
router.get('/:id', UserController.getUser);

module.exports = router;
