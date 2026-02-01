const { CommentRepository } = require('../repositories');

const commentRepo = new CommentRepository();

async function addComment(data) {
    return commentRepo.create(data);
}

async function listComments(reportId) {
    return commentRepo.listByReport(reportId);
}

module.exports = {
    addComment,
    listComments
};
