import React from 'react';
import { jwtDecode } from 'jwt-decode';
import './AdminProfileName.css'; // For styles

const AdminProfileName = () => {
  const token = localStorage.getItem('token');
  const name = token ? jwtDecode(token).name : 'Admin';

  return <div className="admin-profile-name">👤 Profile: {name}</div>;
};

export default AdminProfileName;
