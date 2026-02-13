import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/AdminDashboard';
import ModeratorDashboard from '../pages/ModeratorDashboard';
import UserDashboard from '../pages/UserDashboard';
import CreatePostPage from '../pages/CreatePostPage';
import PostDetailsPage from '../pages/PostDetailsPage';
import UserProfilePage from '../pages/UserProfilePage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      path="/admin"
      element={
        <PrivateRoute allowedRoles={[1]}>
          <AdminDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/moderator"
      element={
        <PrivateRoute allowedRoles={[2]}>
          <ModeratorDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/user"
      element={
        <PrivateRoute allowedRoles={[3]}>
          <UserDashboard />
        </PrivateRoute>
      }
    />

    <Route
      path="/user/create-post"
      element={
        <PrivateRoute allowedRoles={[3]}>
          <CreatePostPage />
        </PrivateRoute>
      }
    />

    <Route
      path="/user/profile"
      element={
        <PrivateRoute allowedRoles={[3]}>
          <UserProfilePage />
        </PrivateRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <PrivateRoute allowedRoles={[1, 2, 3]}>
          <UserProfilePage />
        </PrivateRoute>
      }
    />

    <Route
      path="/posts/:id"
      element={
        <PrivateRoute allowedRoles={[1, 2, 3]}>
          <PostDetailsPage />
        </PrivateRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
