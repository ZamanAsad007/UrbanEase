const express = require('express');
const { PostController, CommentController } = require('../../controllers');

const router = express.Router();

router.get('/', PostController.listPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getPost);
router.patch('/:id/status', PostController.updateStatus);
router.delete('/:id', PostController.deletePost);

router.get('/:id/comments', CommentController.listComments);
router.post('/:id/comments', CommentController.addComment);
router.delete('/:postId/comments/:commentId', CommentController.deleteComment);

module.exports = router;
