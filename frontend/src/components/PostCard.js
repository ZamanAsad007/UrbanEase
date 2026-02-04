import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const truncate = (text, max = 120) => {
  const value = String(text || '');
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
};

const PostCard = ({
  post,
  showModeratorControls = false,
  onChangeStatus,
  onDelete
}) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <h6 className="mb-1">{post.title}</h6>
          <StatusBadge status={post.status} />
        </div>

        <p className="text-muted small mb-3">{truncate(post.description, 140)}</p>

        {showModeratorControls && (
          <div className="d-flex gap-2 align-items-center mb-3">
            <select
              className="form-select form-select-sm"
              value={post.status || 'pending'}
              onChange={(e) => onChangeStatus?.(post.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete?.(post.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        )}

        <div className="mt-auto">
          <Link to={`/posts/${post.id}`} className="btn btn-outline-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
