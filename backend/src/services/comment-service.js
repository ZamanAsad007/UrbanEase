const { CommentRepository } = require('../repositories');

const commentRepo = new CommentRepository();

async function addComment(data) {
    return commentRepo.create(data);
}

async function listComments(postId) {
    return commentRepo.listByPost(postId);
}

async function deleteComment(id) {
    return commentRepo.destroy(id);
}

module.exports = {
    addComment,
    listComments,
    deleteComment
};
