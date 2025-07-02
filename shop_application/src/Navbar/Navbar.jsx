// Navbar.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      localStorage.removeItem("token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout successful!");
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/" onClick={closeMenu}>mkart</NavLink>
        </div>

        <ul className="nav-links">
          <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/product" onClick={closeMenu}>Products</NavLink></li>

          {token && role === 'user' && (
            <>
              <li><NavLink to="/cart" onClick={closeMenu}>Cart</NavLink></li>
              <li><NavLink to="/order" onClick={closeMenu}>Orders</NavLink></li>
            </>
          )}

          {token ? (
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          ) : (
            <>
              <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
              <li><NavLink to="/signup" onClick={closeMenu}>Signup</NavLink></li>
            </>
          )}
        </ul>

        <div className="menu-toggle" onClick={toggleMenu}>☰</div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/product" onClick={closeMenu}>Products</NavLink>

        {token && role === 'user' && (
          <>
            <NavLink to="/cart" onClick={closeMenu}>Cart</NavLink>
            <NavLink to="/order" onClick={closeMenu}>Orders</NavLink>
          </>
        )}

        {token ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/signup" onClick={closeMenu}>Signup</NavLink>
          </>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Navbar;
