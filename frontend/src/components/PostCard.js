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
  onDelete,
  onToggleUpvote
}) => {
  const roleId = Number(localStorage.getItem('role_id'));
  const isUser = roleId === 3;
  const upvoteCount = Number(post?.upvote_count || 0);
  const upvotedByMe = Boolean(Number(post?.upvoted_by_me || 0));

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

        {!showModeratorControls && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge text-bg-light">Upvotes: {upvoteCount}</span>
            {isUser && (
              <button
                type="button"
                className={`btn btn-sm ${upvotedByMe ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => onToggleUpvote?.(post.id)}
              >
                {upvotedByMe ? 'Upvoted' : 'Upvote'}
              </button>
            )}
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
