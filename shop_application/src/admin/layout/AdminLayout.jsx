// AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isOrderDetailsPage = /^\/admin\/orders\/[^/]+$/.test(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        localStorage.removeItem("token");
        return navigate('/login');
      }
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      {!isOrderDetailsPage && (
        <>
          <nav className="admin-navbar">
            <div className="admin-logo">
              <NavLink to="/admin" onClick={closeMenu}>MKart Admin</NavLink>
            </div>

            <ul className="admin-links">
              <li><NavLink to="/admin" end onClick={closeMenu}>Dashboard</NavLink></li>
              <li><NavLink to="/admin/users" onClick={closeMenu}>Users</NavLink></li>
              <li><NavLink to="/admin/products" onClick={closeMenu}>Products</NavLink></li>
              <li><NavLink to="/admin/orders" onClick={closeMenu}>Orders</NavLink></li>
              <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>

            <div className="admin-menu-toggle" onClick={toggleMenu}>☰</div>
          </nav>

          <div className={`admin-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
            <NavLink to="/admin" end onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/admin/users" onClick={closeMenu}>Users</NavLink>
            <NavLink to="/admin/products" onClick={closeMenu}>Products</NavLink>
            <NavLink to="/admin/orders" onClick={closeMenu}>Orders</NavLink>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}

      <div className="admin-outlet">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
