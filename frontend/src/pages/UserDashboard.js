import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PostCard from '../components/PostCard';
import { listPostsByArea, toggleUpvote } from '../services/posts';
import { fetchAreas } from '../services/area';

const UserDashboard = () => {
  const userId = useMemo(() => Number(localStorage.getItem('user_id')), []);
  const storedAreaId = useMemo(() => Number(localStorage.getItem('area_id')), []);

  const sidebarLinks = useMemo(
    () => [
      { label: 'Feed', to: '/user' },
      { label: 'Create Post', to: '/user/create-post' }
    ],
    []
  );

  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(
    storedAreaId && storedAreaId !== 1 ? String(storedAreaId) : ''
  );

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError('');
      try {
        const { data } = await fetchAreas();
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setAreas(list);
        if (!selectedAreaId && list.length > 0) {
          setSelectedAreaId(String(list[0].id));
        }
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load areas');
      }
    })();
    return () => {
      mounted = false;
    };
    // intentionally not including selectedAreaId to avoid re-fetch loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!selectedAreaId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await listPostsByArea(selectedAreaId);
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
  }, [selectedAreaId]);

  const handleToggleUpvote = async (postId) => {
    try {
      const { data } = await toggleUpvote(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                upvote_count: data?.upvote_count ?? p.upvote_count,
                upvoted_by_me: data?.upvoted_by_me ? 1 : 0
              }
            : p
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upvote');
    }
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">User Dashboard</h4>
        <div className="d-flex gap-2">
          <Link to="/user/create-post" className="btn btn-primary btn-sm">
            Create Post
          </Link>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <label className="form-label">Area Feed</label>
          <select
            className="form-select"
            value={selectedAreaId}
            onChange={(e) => {
              setSelectedAreaId(e.target.value);
              localStorage.setItem('area_id', e.target.value);
            }}
            disabled={areas.length === 0}
          >
            {areas.length === 0 ? (
              <option value="">No areas available</option>
            ) : (
              areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))
            )}
          </select>
          {areas.length === 0 && (
            <div className="form-text text-danger">No areas available yet. Ask admin to create areas first.</div>
          )}
        </div>
      </div>

      {loading && <div className="text-muted">Loading posts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="alert alert-info mb-0">No posts found for this area.</div>
      )}

      <div className="row g-3">
        {posts.map((post) => (
          <div key={post.id} className="col-12 col-md-6 col-lg-4">
            <PostCard post={post} onToggleUpvote={handleToggleUpvote} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
