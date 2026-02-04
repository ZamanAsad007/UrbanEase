import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/auth';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    nid: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await registerUser(form);
      setMessage('Registration submitted. Wait for admin approval.');
      setForm({ name: '', email: '', password: '', nid: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm auth-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Register</h4>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">NID</label>
              <input
                type="text"
                className="form-control"
                name="nid"
                value={form.nid}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Register
            </button>
          </form>
          <div className="mt-3 text-center">
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
