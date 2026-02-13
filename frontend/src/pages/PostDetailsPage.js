import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { addCommentToPost, getPostById, toggleUpvote } from '../services/posts';

const absoluteUploadsUrl = (relativePath) => {
  if (!relativePath) return null;
  const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');
  return `${base}${relativePath}`;
};

const PostDetailsPage = () => {
  const { id } = useParams();
  const roleId = useMemo(() => Number(localStorage.getItem('role_id')), []);
  const isUser = roleId === 3;

  const sidebarLinks = useMemo(() => {
    if (roleId === 1) return [{ label: 'Admin Dashboard', to: '/admin' }];
    if (roleId === 2) return [{ label: 'Moderator Dashboard', to: '/moderator' }];
    return [
      { label: 'Feed', to: '/user' },
      { label: 'Create Post', to: '/user/create-post' }
    ];
  }, [roleId]);

  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPost = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getPostById(id);
      setPost(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError('');
    const content = comment.trim();
    if (!content) return;
    setSubmitting(true);
    try {
      await addCommentToPost(id, content);
      setComment('');
      await loadPost();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUpvote = async () => {
    setError('');
    try {
      const { data } = await toggleUpvote(id);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              upvote_count: data?.upvote_count ?? prev.upvote_count,
              upvoted_by_me: data?.upvoted_by_me ? 1 : 0
            }
          : prev
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upvote');
    }
  };

  const backTo = roleId === 1 ? '/admin' : roleId === 2 ? '/moderator' : '/user';

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Post Details</h4>
        <Link to={backTo} className="btn btn-outline-secondary btn-sm">
          Back
        </Link>
      </div>

      {loading && <div className="text-muted">Loading…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {post && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
              <h5 className="mb-0">{post.title}</h5>
              <StatusBadge status={post.status} />
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge text-bg-light">Upvotes: {Number(post.upvote_count || 0)}</span>
              {isUser && (
                <button
                  type="button"
                  className={`btn btn-sm ${Number(post.upvoted_by_me || 0) ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={handleToggleUpvote}
                >
                  {Number(post.upvoted_by_me || 0) ? 'Upvoted' : 'Upvote'}
                </button>
              )}
            </div>

            <p className="text-muted">{post.description}</p>

            {post.location_url && (
              <p>
                <strong>Location:</strong>{' '}
                <a href={post.location_url} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
              </p>
            )}

            <div className="row g-2">
              {post.image_url_1 && (
                <div className="col-md-6">
                  <img
                    alt="Post 1"
                    className="img-fluid rounded border"
                    src={absoluteUploadsUrl(post.image_url_1)}
                  />
                </div>
              )}
              {post.image_url_2 && (
                <div className="col-md-6">
                  <img
                    alt="Post 2"
                    className="img-fluid rounded border"
                    src={absoluteUploadsUrl(post.image_url_2)}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h6>Reply</h6>
              <form onSubmit={handleAddComment}>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a reply..."
                  />
                </div>
                <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
                  {submitting ? 'Posting…' : 'Post Reply'}
                </button>
              </form>
            </div>

            {Array.isArray(post.comments) && post.comments.length > 0 && (
              <div className="mt-4">
                <h6>Comments</h6>
                <ul className="list-group">
                  {post.comments.map((c) => (
                    <li key={c.id} className="list-group-item">
                      <div className="small text-muted">{c.user_name || `User #${c.user_id}`}</div>
                      <div>{c.content}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(post.comments) && post.comments.length === 0 && (
              <div className="mt-4 text-muted">No comments yet.</div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PostDetailsPage;
