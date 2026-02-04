import api from './api';

export const createArea = (name) => api.post('/areas', { name });

export const fetchPendingUsers = () => api.get('/users/pending');
export const approveUser = (id) => api.patch(`/users/${id}/approve`);
export const rejectUser = (id) => api.patch(`/users/${id}/reject`);

export const createModerator = (payload) => api.post('/users/moderators', payload);
