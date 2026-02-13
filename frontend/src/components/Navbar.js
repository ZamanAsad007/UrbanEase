import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMe } from '../services/user';

const absoluteUploadsUrl = (relativePath) => {
  if (!relativePath) return null;
  const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');
  return `${base}${relativePath}`;
};

const Navbar = () => {
  const token = localStorage.getItem('token');
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('profile_image_url') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || '');

  useEffect(() => {
    if (!token) {
      setAvatarUrl('');
      return;
    }
    let mounted = true;

    const load = async () => {
      try {
        const { data } = await getMe();
        const rel = data?.profile_image_url || '';
        const name = data?.name || '';
        localStorage.setItem('profile_image_url', rel);
        localStorage.setItem('user_name', name);
        if (mounted) setAvatarUrl(rel);
        if (mounted) setUserName(name);
      } catch {
        // ignore; navbar should still render
      }
    };

    load();

    const onProfileUpdated = () => {
      const rel = localStorage.getItem('profile_image_url') || '';
      const name = localStorage.getItem('user_name') || '';
      setAvatarUrl(rel);
      setUserName(name);
    };
    window.addEventListener('profile:updated', onProfileUpdated);

    return () => {
      mounted = false;
      window.removeEventListener('profile:updated', onProfileUpdated);
    };
  }, [token]);

  const profileTo = token ? '/profile' : '#';

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3 app-navbar sticky-top">
      <span className="navbar-brand mb-0 h1">UrbanEase</span>

      {token && (
        <div className="d-flex align-items-center gap-2">
          <Link
            to={profileTo}
            className="text-decoration-none d-flex align-items-center gap-2"
            aria-label="Profile"
            title="Profile"
          >
            <span className="fw-semibold text-dark">{userName || 'Profile'}</span>
            {avatarUrl ? (
              <img
                src={absoluteUploadsUrl(avatarUrl)}
                alt="Profile"
                width="32"
                height="32"
                style={{ objectFit: 'cover', borderRadius: '999px' }}
              />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid #dee2e6' }} />
            )}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
