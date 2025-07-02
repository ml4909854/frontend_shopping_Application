import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminOrders.css';
import AdminProfileName from '../AdminProfile/AdminProfileName';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [adminName, setAdminName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminName(decoded.name || 'Admin');
      } catch (err) {
        console.error('Failed to decode token');
      }
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      setFilteredOrders(applyFilters(sorted, statusFilter, dateFilter));
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const applyFilters = (orders, status, date) => {
    let temp = [...orders];

    if (status !== 'all') {
      temp = temp.filter((o) => o.status === status);
    }

    if (date !== 'all') {
      const today = new Date();
      const todayStr = today.toDateString();
      const yesterdayStr = new Date(today.setDate(today.getDate() - 1)).toDateString();
      const tomorrowStr = new Date(today.setDate(today.getDate() + 2)).toDateString();

      temp = temp.filter((o) => {
        const d = new Date(o.deliveryDate).toDateString();
        if (date === 'today') return d === todayStr;
        if (date === 'yesterday') return d === yesterdayStr;
        if (date === 'tomorrow') return d === tomorrowStr;
        return true;
      });
    }

    return temp;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(applyFilters(orders, statusFilter, dateFilter));
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, dateFilter, orders]);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/updateStatus/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        const updatedOrders = orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="admin-orders-wrapper">
      {/* ✅ Admin Profile Top Right */}
      <div className="admin-profile-top">
        <AdminProfileName/>
      </div>

      <aside className="orders-sidebar">
        <h3>Status</h3>
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            className={statusFilter === status ? 'active' : ''}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}

        <h3>Delivery Date</h3>
        {['all', 'today', 'yesterday', 'tomorrow'].map((date) => (
          <button
            key={date}
            className={dateFilter === date ? 'active' : ''}
            onClick={() => setDateFilter(date)}
          >
            {date.charAt(0).toUpperCase() + date.slice(1)}
          </button>
        ))}
      </aside>

      <main>
        <h2>All Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Update</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, idx) => (
              <tr key={order._id}>
                <td>{indexOfFirstOrder + idx + 1}</td>
                <td>{order.userId?.name || 'Unknown'}</td>
                <td>{order.products?.length} item(s)</td>
                <td><strong>₹{order.totalAmount}</strong></td>
                <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td className={`status ${order.status}`}>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/admin/order/${order._id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination */}
        <div className="pagination">
          <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
            Prev
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
