const express = require('express');
const { PostController, CommentController } = require('../../controllers');
const upload = require('../../middlewares/upload');
const { authenticate, optionalAuthenticate, requireRole } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', optionalAuthenticate, PostController.listPosts);
router.post('/', upload.array('images', 2), PostController.createPost);
router.get('/:id', optionalAuthenticate, PostController.getPost);
router.patch('/:id/status', authenticate, requireRole('moderator', 'admin'), PostController.updateStatus);
router.delete('/:id', authenticate, requireRole('moderator', 'admin'), PostController.deletePost);

router.get('/:id/comments', CommentController.listComments);
router.post('/:id/comments', CommentController.addComment);
router.delete('/:postId/comments/:commentId', authenticate, requireRole('moderator', 'admin'), CommentController.deleteComment);

module.exports = router;
