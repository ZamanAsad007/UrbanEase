import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ sidebarItems, children }) => (
  <div className="page-shell">
    <Navbar />
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar items={sidebarItems} />
        </div>
        <main className="col-12 col-md-9 col-lg-10 dashboard-content">
          {children}
        </main>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
