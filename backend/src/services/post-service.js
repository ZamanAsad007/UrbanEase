const { PostRepository } = require('../repositories');

const postRepo = new PostRepository();

async function createPost(data) {
    return postRepo.create(data);
}

async function listPostsByArea(areaId) {
    return postRepo.listByArea(areaId);
}

async function listPostsByUser(userId) {
    return postRepo.listByUser(userId);
}

async function getPost(id) {
    return postRepo.get(id);
}

async function updatePostStatus(id, status) {
    return postRepo.updateStatus(id, status);
}

async function deletePost(id) {
    return postRepo.destroy(id);
}

module.exports = {
    createPost,
    listPostsByArea,
    listPostsByUser,
    getPost,
    updatePostStatus,
    deletePost
};
