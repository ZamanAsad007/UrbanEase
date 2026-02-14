const { PostService, CommentService } = require('../services');

async function createPost(req, res) {
    try {
        const { user_id, area_id, title, description, location_url } = req.body;
        if (!user_id || !area_id || !title || !description) {
            return res.status(400).json({ message: 'user_id, area_id, title, description are required' });
        }
        const files = req.files || [];
        const image_url_1 = files[0] ? `/uploads/${files[0].filename}` : null;
        const image_url_2 = files[1] ? `/uploads/${files[1].filename}` : null;
        const result = await PostService.createPost({
            user_id,
            area_id,
            title,
            description,
            location_url: location_url || null,
            image_url_1,
            image_url_2,
            status: 'pending'
        });
        return res.status(201).json({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function listPosts(req, res) {
    try {
        const { area_id, status } = req.query;
        if (!area_id) {
            return res.status(400).json({ message: 'area_id is required' });
        }
        if (req.user && req.user.role_id === 2 && Number(area_id) !== Number(req.user.area_id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const posts = await PostService.listPostsByArea(area_id, req.user ? req.user.id : null, status);
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function listMyPosts(req, res) {
    try {
        const posts = await PostService.listPostsByUser(req.user.id);
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getPost(req, res) {
    try {
        const post = await PostService.getPost(req.params.id, req.user ? req.user.id : null);
        if (req.user && req.user.role_id === 2 && Number(post.area_id) !== Number(req.user.area_id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const comments = await CommentService.listComments(req.params.id);
        return res.status(200).json({ ...post, comments });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

async function toggleUpvote(req, res) {
    try {
        const postId = Number(req.params.id);
        if (!postId) {
            return res.status(400).json({ message: 'Invalid post id' });
        }
        const result = await PostService.toggleUpvote(postId, req.user.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'status is required' });
        }
        await PostService.updatePostStatus(req.params.id, status);
        return res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deletePost(req, res) {
    try {
        await PostService.deletePost(req.params.id);
        return res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPost,
    listPosts,
    listMyPosts,
    getPost,
    toggleUpvote,
    updateStatus,
    deletePost
};
