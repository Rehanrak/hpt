import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth();

  const studentNav = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'find-partner', icon: '🔍', label: 'Find Partner' },
    { id: 'my-requests', icon: '📋', label: 'Swap Requests' },
    { id: 'profile', icon: '👤', label: 'My Profile' }
  ];

  const adminNav = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'all-requests', icon: '📋', label: 'Swap Requests' },
    { id: 'batch-records', icon: '🎓', label: 'Batch Records' },
  ];

  const navItems = user?.role === 'admin' ? adminNav : studentNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>⇄ SwapSys</h2>
        <p>{user?.role === 'admin' ? 'HOD Panel' : 'Student Portal'}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.reg_no || user?.role}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 8 }} onClick={logout}>
          ⎋ Sign Out
        </button>
      </div>
    </aside>
  );
}
