import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsers.css';
import AdminProfileName from '../AdminProfile/AdminProfileName';

const USERS_PER_PAGE = 20;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.user || [];
      setUsers(data);
      setFiltered(data);
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let temp = [...users];

    if (search.trim()) {
      temp = temp.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      temp = temp.filter((u) => u.role && u.role === roleFilter);
    }

    setFiltered(temp);
    setPage(1); // Reset page on filter/search
  }, [search, roleFilter, users]);

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalPages]);

  const visible = filtered.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  const isAdmin = true; // assume admin

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="admin-users-page">
      {/* ✅ Admin Profile Component */}
      <AdminProfileName />

      <div className="admin-users-wrapper">
        <aside className="sidebar">
          <h3>Filter by Role</h3>
          {['all', 'admin', 'user'].map((r) => {
            const label = r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1);
            const count =
              r === 'all'
                ? users.length
                : users.filter((u) => u.role === r).length;

            return (
              <button
                key={r}
                className={roleFilter === r ? 'active' : ''}
                onClick={() => setRoleFilter(r)}
              >
                {label} ({count})
              </button>
            );
          })}
        </aside>

        <main>
          <div className="top-bar">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span>Total: {filtered.length}</span>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found.</td>
                </tr>
              ) : (
                visible.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{(page - 1) * USERS_PER_PAGE + idx + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    {isAdmin && (
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
