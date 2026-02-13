const { PostRepository, PostUpvoteRepository } = require('../repositories');

const postRepo = new PostRepository();
const upvoteRepo = new PostUpvoteRepository();

async function createPost(data) {
    return postRepo.create(data);
}

async function listPostsByArea(areaId, userId = null) {
    return postRepo.listByArea(areaId, userId);
}

async function listPostsByUser(userId) {
    return postRepo.listByUser(userId);
}

async function getPost(id, userId = null) {
    return postRepo.getWithVotes(id, userId);
}

async function toggleUpvote(postId, userId) {
    const exists = await upvoteRepo.exists(postId, userId);
    if (exists) {
        await upvoteRepo.remove(postId, userId);
    } else {
        await upvoteRepo.add(postId, userId);
    }
    const upvote_count = await upvoteRepo.countForPost(postId);
    return { upvote_count, upvoted_by_me: !exists };
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
    toggleUpvote,
    updatePostStatus,
    deletePost
};
