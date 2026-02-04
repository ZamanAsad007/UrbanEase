import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container py-5">
    <h3>Page not found</h3>
    <Link to="/login">Go to login</Link>
  </div>
);

export default NotFound;
