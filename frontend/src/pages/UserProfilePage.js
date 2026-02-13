import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PostCard from '../components/PostCard';
import { listMyPosts } from '../services/posts';
import { changeMyPassword, getMe, updateMyName, uploadMyAvatar } from '../services/user';

const absoluteUploadsUrl = (relativePath) => {
  if (!relativePath) return null;
  const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');
  return `${base}${relativePath}`;
};

const UserProfilePage = () => {
  const userId = useMemo(() => Number(localStorage.getItem('user_id')), []);

  const sidebarLinks = useMemo(
    () => [
      { label: 'Feed', to: '/user' },
      { label: 'Create Post', to: '/user/create-post' }
    ],
    []
  );

  const [me, setMe] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [meRes, postsRes] = await Promise.all([getMe(), listMyPosts()]);
      setMe(meRes.data);
      setName(meRes.data?.name || '');
      setMyPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await updateMyName(name);
      setMe(data);
      localStorage.setItem('user_name', data?.name || '');
      window.dispatchEvent(new Event('profile:updated'));
      setMessage('Name updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await changeMyPassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setMessage('Password updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage('');
    setError('');
    try {
      const { data } = await uploadMyAvatar(file);
      setMe(data);
      localStorage.setItem('profile_image_url', data?.profile_image_url || '');
      window.dispatchEvent(new Event('profile:updated'));
      setMessage('Profile picture updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Profile</h4>
      </div>

      {loading && <div className="text-muted">Loading…</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {me && (
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Basic Info</h6>

                {me.profile_image_url ? (
                  <img
                    alt="Profile"
                    src={absoluteUploadsUrl(me.profile_image_url)}
                    className="img-fluid rounded border mb-3"
                  />
                ) : (
                  <div className="text-muted mb-3">No profile picture yet.</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Change profile picture</label>
                  <input className="form-control" type="file" accept="image/*" onChange={handleAvatarChange} />
                </div>

                <div className="small text-muted">Email: {me.email}</div>
                <div className="small text-muted">Role ID: {me.role_id}</div>
                <div className="small text-muted">Area ID: {me.area_id}</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h6 className="mb-3">Edit Name</h6>
                <form onSubmit={handleNameUpdate}>
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="form-text">You can change your name once every 30 days.</div>
                  <button className="btn btn-primary btn-sm mt-2" type="submit">
                    Save Name
                  </button>
                </form>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Change Password</h6>
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-2">
                    <label className="form-label">Old Password</label>
                    <input className="form-control" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">New Password</label>
                    <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </div>
                  <button className="btn btn-primary btn-sm" type="submit">
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="mb-0">My Posts</h5>
              <button className="btn btn-outline-secondary btn-sm" type="button" onClick={load}>
                Refresh
              </button>
            </div>

            {myPosts.length === 0 ? (
              <div className="alert alert-info mb-0">No posts yet.</div>
            ) : (
              <div className="row g-3">
                {myPosts.map((p) => (
                  <div key={p.id} className="col-12 col-md-6 col-lg-4">
                    <PostCard post={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserProfilePage;
