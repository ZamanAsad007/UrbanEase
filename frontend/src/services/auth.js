import api from './api';

export const registerUser = (payload) => api.post('/users/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
