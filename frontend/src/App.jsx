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

function App() {
  const { user, loading } = useAuth();
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

  const renderPage = () => {
    if (user.role === 'admin') {
      switch (active) {
        case 'dashboard':     return <AdminDashboard setActive={setActive} />;
        case 'all-requests':  return <ManageRequests />;
        case 'batch-records': return <BatchRecords />;
        default:              return <AdminDashboard setActive={setActive} />;
      }
    } else {
      switch (active) {
        case 'dashboard':     return <StudentDashboard setActive={setActive} />;
        case 'find-partner':  return <FindPartner setActive={setActive} />;
        case 'my-requests':   return <MyRequests />;
        case 'profile':       return <Profile />;
        default:              return <StudentDashboard setActive={setActive} />;
      }
    }
  };

  return (
    <div className="app-layout">
      <Sidebar active={active} setActive={setActive} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
