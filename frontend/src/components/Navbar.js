import React from 'react';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role_id');
    localStorage.removeItem('area_id');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3">
      <span className="navbar-brand mb-0 h1">UrbanEase</span>
      <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
