import React from 'react';

const STATUS_META = {
  pending: { label: 'Pending', className: 'bg-warning text-dark' },
  in_progress: { label: 'In Progress', className: 'bg-info text-dark' },
  resolved: { label: 'Resolved', className: 'bg-success' }
};

const StatusBadge = ({ status }) => {
  const key = String(status || '').toLowerCase();
  const meta = STATUS_META[key] || { label: status || 'Unknown', className: 'bg-secondary' };

  return <span className={`badge ${meta.className}`}>{meta.label}</span>;
};

export default StatusBadge;
