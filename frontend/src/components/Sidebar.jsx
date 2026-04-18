import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth();

  if (user?.role === 'admin' || user?.role === 'hod' || user?.role === 'faculty_coordinator') {
    return (
      <div className="admin-sidebar">
        <div className="sidebar-title">Navigation</div>
        <button className={`sidebar-link ${active === 'dashboard' ? 'active-link' : ''}`} onClick={() => setActive('dashboard')}>
          <span className="sidebar-icon">📊</span>Dashboard
        </button>
        <button className={`sidebar-link ${active === 'pending' ? 'active-link' : ''}`} onClick={() => setActive('pending')}>
          <span className="sidebar-icon">⏳</span>Pending Requests
          <span style={{ marginLeft: 'auto', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>1</span>
        </button>
        <button className={`sidebar-link ${active === 'batch-records' ? 'active-link' : ''}`} onClick={() => setActive('batch-records')}>
          <span className="sidebar-icon">👥</span>Batch Records
        </button>
        <button className={`sidebar-link ${active === 'audit-log' ? 'active-link' : ''}`} onClick={() => setActive('audit-log')}>
          <span className="sidebar-icon">📋</span>Audit Log
        </button>
        {user?.role === 'admin' && (
          <button className={`sidebar-link ${active === 'manage-users' ? 'active-link' : ''}`} onClick={() => setActive('manage-users')}>
            <span className="sidebar-icon">👤</span>Manage Users
          </button>
        )}
        
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-warn btn-sm w-full" style={{ justifyContent: 'center' }}>
            🗑 Reset All Data
          </button>
        </div>
      </div>
    );
  }

  const studentNav = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'find-partner', icon: '🔍', label: 'Find Partner' },
    { id: 'my-requests', icon: '📋', label: 'Swap Requests' },
    { id: 'profile', icon: '👤', label: 'My Profile' }
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>⇄ SwapSys</h2>
        <p>Student Portal</p>
      </div>

      <nav className="sidebar-nav">
        {studentNav.map(item => (
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
