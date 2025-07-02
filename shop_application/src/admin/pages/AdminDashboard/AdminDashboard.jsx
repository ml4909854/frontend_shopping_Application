import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import AdminProfileName from '../AdminProfile/AdminProfileName';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    })();
  }, []);

  if (!stats) return <div className="admin-dashboard">Loading dashboard...</div>;

  const { totalOrders, totalUsers, totalProducts, totalRevenue } = stats.stats;
  const { recentOrders, lowStockProducts } = stats;

  return (
    <div className="admin-dashboard">
      {/* ✅ Top Right Admin Name */}
      <AdminProfileName />

      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        {[
          { label: 'Total Orders', value: totalOrders, color: '#ff9900' },
          { label: 'Total Users', value: totalUsers, color: '#007bff' },
          { label: 'Total Products', value: totalProducts, color: '#28a745' },
          { label: 'Revenue (Delivered Only)', value: `₹${totalRevenue}`, color: '#dc3545' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
            <h3>{label}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>

      <div className="tables-container">
        <div className="table-section">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id}>
                  <td>{o._id.slice(-6)}</td>
                  <td>{o.userId?.name || 'N/A'}</td>
                  <td>₹{o.totalAmount}</td>
                  <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h2>Low Stock Products</h2>
          <table>
            <thead><tr><th>Product</th><th>Price</th></tr></thead>
            <tbody>
              {lowStockProducts.map(p => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>₹{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
