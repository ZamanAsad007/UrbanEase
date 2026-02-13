const { CommentService } = require('../services');

async function addComment(req, res) {
    try {
        const { content } = req.body;
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!content) {
            return res.status(400).json({ message: 'content is required' });
        }
        const post_id = req.params.id;
        const result = await CommentService.addComment({ post_id, user_id, content });
        return res.status(201).json({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function listComments(req, res) {
    try {
        const comments = await CommentService.listComments(req.params.id);
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteComment(req, res) {
    try {
        await CommentService.deleteComment(req.params.commentId);
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addComment,
    listComments,
    deleteComment
};
