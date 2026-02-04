import React from 'react';

const Sidebar = ({ items = [] }) => (
  <div className="bg-white border-end" style={{ minHeight: '100vh' }}>
    <div className="list-group list-group-flush">
      {items.map((item) => (
        <span key={item} className="list-group-item list-group-item-action">
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default Sidebar;
