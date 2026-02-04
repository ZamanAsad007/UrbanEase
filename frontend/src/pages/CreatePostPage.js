import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { createPost } from '../services/posts';
import { fetchAreas } from '../services/area';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const userId = useMemo(() => Number(localStorage.getItem('user_id')), []);
  const [areas, setAreas] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location_url: '',
    area_id: ''
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await fetchAreas();
        if (mounted) setAreas(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load areas');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles(picked.slice(0, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('Missing user session (user_id). Please login again.');
      return;
    }
    if (!form.area_id) {
      setError('Please select an area.');
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    if (files.length > 2) {
      setError('You can upload at most 2 images.');
      return;
    }

    const data = new FormData();
    data.append('user_id', String(userId));
    data.append('area_id', String(form.area_id));
    data.append('title', form.title);
    data.append('description', form.description);
    if (form.location_url?.trim()) data.append('location_url', form.location_url.trim());

    files.forEach((f) => data.append('images', f));

    setSubmitting(true);
    try {
      await createPost(data);
      setSuccess('Post submitted!');
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={['My Area Posts', 'Create Post']}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Create Post</h4>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Area</label>
              <select
                className="form-select"
                name="area_id"
                value={form.area_id}
                onChange={handleChange}
                required
              >
                <option value="">Select area</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {areas.length === 0 && (
                <div className="form-text text-danger">No areas available yet. Ask admin to create areas first.</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image upload (max 2)</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
              />
              <div className="form-text">Backend field name: images</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Google Maps link (optional)</label>
              <input
                className="form-control"
                name="location_url"
                value={form.location_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePostPage;
