import api from './api';

export const listPostsByArea = (areaId) => api.get('/posts', { params: { area_id: areaId } });
export const listMyPosts = () => api.get('/posts/mine');
export const getPostById = (id) => api.get(`/posts/${id}`);

export const createPost = (formData) =>
  api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const updatePostStatus = (id, status) => api.patch(`/posts/${id}/status`, { status });
export const deletePost = (id) => api.delete(`/posts/${id}`);
