import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ links = [], onLogout }) => (
  <div className="bg-white border-end d-flex flex-column min-vh-100 sidebar-shell">
    <div className="list-group list-group-flush">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `list-group-item list-group-item-action${isActive ? ' active' : ''}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>

    <div className="mt-auto p-3">
      <button className="btn btn-outline-secondary w-100 btn-sm" type="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  </div>
);

export default Sidebar;
