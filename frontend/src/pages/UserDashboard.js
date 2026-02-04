import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PostCard from '../components/PostCard';
import { listMyPosts } from '../services/posts';

const UserDashboard = () => {
  const userId = useMemo(() => Number(localStorage.getItem('user_id')), []);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await listMyPosts();
        if (mounted) setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load posts');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <DashboardLayout sidebarItems={['My Area Posts', 'Create Post']}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">User Dashboard</h4>
        <Link to="/user/create-post" className="btn btn-primary btn-sm">
          Create Post
        </Link>
      </div>

      {loading && <div className="text-muted">Loading posts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="alert alert-info mb-0">You haven’t created any posts yet.</div>
      )}

      <div className="row g-3">
        {posts.map((post) => (
          <div key={post.id} className="col-12 col-md-6 col-lg-4">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
