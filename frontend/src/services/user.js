import api from './api';

export const getMe = () => api.get('/users/me');
export const updateMyName = (name) => api.patch('/users/me/name', { name });
export const changeMyPassword = (old_password, new_password) =>
  api.patch('/users/me/password', { old_password, new_password });

export const uploadMyAvatar = (file) => {
  const data = new FormData();
  data.append('image', file);
  return api.patch('/users/me/avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
