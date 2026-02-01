const express = require('express');
const { ReportController, CommentController, VoteController } = require('../../controllers');

const router = express.Router();

router.get('/', ReportController.listReports);
router.post('/', ReportController.createReport);
router.get('/:id', ReportController.getReport);
router.patch('/:id/status', ReportController.updateStatus);

router.get('/:id/comments', CommentController.listComments);
router.post('/:id/comments', CommentController.addComment);

router.post('/:id/upvote', VoteController.upvote);
router.delete('/:id/upvote', VoteController.removeUpvote);

module.exports = router;
