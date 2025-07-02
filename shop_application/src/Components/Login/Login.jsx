import React, { useEffect, useState } from 'react';
import './Login.css';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        form
      );

      alert(res.data.message);
      const token = res.data.token;

      localStorage.setItem('token', token);
      setForm({ email: '', password: '' });

      // ✅ Decode role from token and redirect
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/product');
      }

    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || 'Login failed!');
      } else {
        alert('Something went wrong. Try again.');
      }
      console.error('Login Error:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
