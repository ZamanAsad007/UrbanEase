import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PostCard from '../components/PostCard';
import { deletePost, listPostsByArea, updatePostStatus } from '../services/posts';

const ModeratorDashboard = () => {
  const areaId = useMemo(() => Number(localStorage.getItem('area_id')), []);

  const sidebarLinks = useMemo(() => [{ label: 'Dashboard', to: '/moderator' }], []);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const status = activeTab === 'pending' ? 'pending' : 'approved,rejected';
      const { data } = await listPostsByArea(areaId, status);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, activeTab]);

  const handleChangeStatus = async (postId, status) => {
    try {
      await updatePostStatus(postId, status);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (postId) => {
    const ok = window.confirm('Delete this post?');
    if (!ok) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Moderator Dashboard</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadPosts} type="button">
          Refresh
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Posts
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved Posts
          </button>
        </li>
      </ul>

      {loading && <div className="text-muted">Loading posts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="alert alert-info mb-0">
          No {activeTab} posts found in your assigned area.
        </div>
      )}

      <div className="row g-3">
        {posts.map((post) => (
          <div key={post.id} className="col-12 col-md-6 col-lg-4">
            <PostCard
              post={post}
              showModeratorControls={activeTab === 'pending'}
              onChangeStatus={handleChangeStatus}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ModeratorDashboard;
