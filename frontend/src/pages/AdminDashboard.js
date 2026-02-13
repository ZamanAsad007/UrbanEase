import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchAreas } from '../services/area';
import {
  approveUser,
  createArea,
  createModerator,
  fetchPendingUsers,
  rejectUser
} from '../services/admin';

const AdminDashboard = () => {
  const [areas, setAreas] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  const sidebarLinks = [
    { label: 'Create Area', to: '/admin#create-area' },
    { label: 'Create Moderator', to: '/admin#create-moderator' },
    { label: 'Approve Users', to: '/admin#pending-users' }
  ];

  const [areaName, setAreaName] = useState('');
  const [modForm, setModForm] = useState({
    name: '',
    email: '',
    password: '',
    nid: '',
    area_id: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const visibleAreas = areas.filter((a) => {
    const name = String(a?.name || '').toLowerCase();
    return Number(a?.id) !== 1 && name !== 'unassigned' && name !== 'dhaka';
  });

  const loadAll = async () => {
    setError('');
    try {
      const [areasRes, pendingRes] = await Promise.all([fetchAreas(), fetchPendingUsers()]);
      setAreas(Array.isArray(areasRes.data) ? areasRes.data : []);
      setPendingUsers(Array.isArray(pendingRes.data) ? pendingRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateArea = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await createArea(areaName.trim());
      setMessage('Area created');
      setAreaName('');
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create area');
    }
  };

  const handleModChange = (e) => {
    setModForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateModerator = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await createModerator({
        ...modForm,
        area_id: Number(modForm.area_id)
      });
      setMessage('Moderator created');
      setModForm({ name: '', email: '', password: '', nid: '', area_id: '' });
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create moderator');
    }
  };

  const handleApprove = async (id) => {
    setMessage('');
    setError('');
    try {
      await approveUser(id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage('User approved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleReject = async (id) => {
    setMessage('');
    setError('');
    try {
      await rejectUser(id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage('User rejected');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject user');
    }
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Admin Dashboard</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadAll} type="button">
          Refresh
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3" id="create-area">Create Area</h6>
              <form onSubmit={handleCreateArea}>
                <div className="mb-3">
                  <label className="form-label">Area Name</label>
                  <input
                    className="form-control"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3" id="create-moderator">Create Moderator</h6>
              <form onSubmit={handleCreateModerator}>
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input className="form-control" name="name" value={modForm.name} onChange={handleModChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" name="email" value={modForm.email} onChange={handleModChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Password</label>
                  <input className="form-control" type="password" name="password" value={modForm.password} onChange={handleModChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">NID</label>
                  <input className="form-control" name="nid" value={modForm.nid} onChange={handleModChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Area</label>
                  <select className="form-select" name="area_id" value={modForm.area_id} onChange={handleModChange} required>
                    <option value="">Select area</option>
                    {visibleAreas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" type="submit">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3" id="pending-users">Pending Users</h6>

              {pendingUsers.length === 0 ? (
                <div className="text-muted">No pending users.</div>
              ) : (
                <div className="list-group">
                  {pendingUsers.map((u) => (
                    <div key={u.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="fw-semibold">{u.name}</div>
                          <div className="small text-muted">{u.email}</div>
                          <div className="small text-muted">NID: {u.nid}</div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm" type="button" onClick={() => handleApprove(u.id)}>
                            Approve
                          </button>
                          <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => handleReject(u.id)}>
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
