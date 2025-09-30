import { useState, useEffect } from 'react';
import { admin } from '../services/api';
import type { User } from '../types';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await admin.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await admin.banUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Failed to ban user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await admin.unbanUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Failed to unban user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true;
    if (filter === 'banned') return user.isBanned;
    return user.role === filter;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and system settings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Clients</h3>
          <p className="stat-number">{users.filter((u) => u.role === 'client').length}</p>
        </div>
        <div className="stat-card">
          <h3>Freelancers</h3>
          <p className="stat-number">{users.filter((u) => u.role === 'freelancer').length}</p>
        </div>
        <div className="stat-card">
          <h3>Banned Users</h3>
          <p className="stat-number">{users.filter((u) => u.isBanned).length}</p>
        </div>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Users
        </button>
        <button
          className={`filter-btn ${filter === 'client' ? 'active' : ''}`}
          onClick={() => setFilter('client')}
        >
          Clients
        </button>
        <button
          className={`filter-btn ${filter === 'freelancer' ? 'active' : ''}`}
          onClick={() => setFilter('freelancer')}
        >
          Freelancers
        </button>
        <button
          className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
          onClick={() => setFilter('admin')}
        >
          Admins
        </button>
        <button
          className={`filter-btn ${filter === 'banned' ? 'active' : ''}`}
          onClick={() => setFilter('banned')}
        >
          Banned
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isBanned ? 'status-banned' : 'status-active'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        className={`btn-small ${user.isBanned ? 'btn-success' : 'btn-danger'}`}
                        onClick={() =>
                          user.isBanned ? handleUnbanUser(user._id) : handleBanUser(user._id)
                        }
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id
                          ? '...'
                          : user.isBanned
                          ? 'Unban'
                          : 'Ban'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="empty-state">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}