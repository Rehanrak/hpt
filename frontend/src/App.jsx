import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/Sidebar';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import FindPartner from './pages/student/FindPartner';
import MyRequests from './pages/student/MyRequests';
import Profile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRequests from './pages/admin/ManageRequests';
import BatchRecords from './pages/admin/BatchRecords';
import AuditLog from './pages/admin/AuditLog';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  const { user, loading, logout } = useAuth();
  const [active, setActive] = useState('dashboard');

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderAdminPage = () => {
    switch (active) {
      case 'dashboard': return <AdminDashboard setActive={setActive} />;
      case 'pending': return <ManageRequests />;
      case 'batch-records': return <BatchRecords />;
      case 'audit-log': return <AuditLog />;
      case 'manage-users': return <ManageUsers />;
      default: return <AdminDashboard setActive={setActive} />;
    }
  };

  const renderStudentPage = () => {
    switch (active) {
      case 'dashboard':     return <StudentDashboard setActive={setActive} />;
      case 'find-partner':  return <FindPartner setActive={setActive} />;
      case 'my-requests':   return <MyRequests />;
      case 'profile':       return <Profile />;
      default:              return <StudentDashboard setActive={setActive} />;
    }
  };

  if (user.role === 'admin') {
    return (
      <div id="root">
        <nav className="navbar">
          <a className="nav-brand" href="#!">
            <div className="nav-logo">BS</div>
            <span className="nav-name">BatchSwap - Admin</span>
          </a>
          <div className="nav-right">
            <div className="storage-pill saved">
              <div className="storage-dot"></div>
              <span>Saved offline</span>
            </div>
            <div className="avatar-btn" style={{ background: 'linear-gradient(135deg, var(--danger), var(--warning))' }}>A</div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Admin · System Administrator</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-layout">
          <Sidebar active={active} setActive={setActive} />
          <div className="admin-content">
            <main className="main" style={{ flex: 1, padding: '32px 28px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
              {renderAdminPage()}
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'hod') {
    return (
      <div id="root">
        <nav className="navbar">
          <a className="nav-brand" href="#!">
            <div className="nav-logo">BS</div>
            <span className="nav-name">BatchSwap - HOD</span>
          </a>
          <div className="nav-right">
            <div className="storage-pill saved">
              <div className="storage-dot"></div>
              <span>Saved offline</span>
            </div>
            <div className="avatar-btn" style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))' }}>H</div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.name} · HOD</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-layout">
          <Sidebar active={active} setActive={setActive} />
          <div className="admin-content">
            <main className="main" style={{ flex: 1, padding: '32px 28px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
              {renderAdminPage()}
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'faculty_coordinator') {
    return (
      <div id="root">
        <nav className="navbar">
          <a className="nav-brand" href="#!">
            <div className="nav-logo">BS</div>
            <span className="nav-name">BatchSwap - Faculty Coordinator</span>
          </a>
          <div className="nav-right">
            <div className="storage-pill saved">
              <div className="storage-dot"></div>
              <span>Saved offline</span>
            </div>
            <div className="avatar-btn" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' }}>F</div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.name} · Faculty Coordinator</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-layout">
          <Sidebar active={active} setActive={setActive} />
          <div className="admin-content">
            <main className="main" style={{ flex: 1, padding: '32px 28px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
              {renderAdminPage()}
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar active={active} setActive={setActive} />
      <main className="main-content">
        {renderStudentPage()}
      </main>
    </div>
  );
}

export default App;
