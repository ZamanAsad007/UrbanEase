import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('role_id', data.user.role_id);
      localStorage.setItem('area_id', data.user.area_id);

      if (data.user.role_id === 1) {
        navigate('/admin');
      } else if (data.user.role_id === 2) {
        navigate('/moderator');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm auth-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Login</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
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
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
          <div className="mt-3 text-center">
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
