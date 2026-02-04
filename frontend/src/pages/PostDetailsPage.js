import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getPostById } from '../services/posts';

const absoluteUploadsUrl = (relativePath) => {
  if (!relativePath) return null;
  const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');
  return `${base}${relativePath}`;
};

const PostDetailsPage = () => {
  const { id } = useParams();
  const roleId = useMemo(() => Number(localStorage.getItem('role_id')), []);

  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getPostById(id);
        if (mounted) setPost(data);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const backTo = roleId === 1 ? '/admin' : roleId === 2 ? '/moderator' : '/user';

  return (
    <DashboardLayout sidebarItems={['Post Details']}>
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

            {Array.isArray(post.comments) && post.comments.length > 0 && (
              <div className="mt-4">
                <h6>Comments</h6>
                <ul className="list-group">
                  {post.comments.map((c) => (
                    <li key={c.id} className="list-group-item">
                      <div className="small text-muted">User #{c.user_id}</div>
                      <div>{c.content}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PostDetailsPage;
