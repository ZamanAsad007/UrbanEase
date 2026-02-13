import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ sidebarLinks = [], children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role_id');
    localStorage.removeItem('area_id');
    localStorage.removeItem('profile_image_url');
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-2 p-0">
            <Sidebar links={sidebarLinks} onLogout={handleLogout} />
          </div>
          <main className="col-12 col-md-9 col-lg-10 dashboard-content">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
