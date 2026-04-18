import React, { useState } from 'react';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

const Toast = ({ message, type }) =>
  message ? <div className={`toast ${type}`}>{type === 'error' ? '✗' : '✓'} {message}</div> : null;

export default function AuthPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For students, send regNo as email to backend (backend checks both email and reg_no)
      const loginPayload = tab === 'student' 
        ? { email: loginData.regNo, password: loginData.password }
        : loginData;
      const res = await loginUser(loginPayload);
      const user = res.data.user;
      
      // Validate role matches the selected tab
      if (tab === 'admin' && user.role !== 'admin') {
        showToast('Only admin credentials can be used in Admin portal.');
        setLoading(false);
        return;
      }
      if (tab === 'hod' && user.role !== 'hod') {
        showToast('Only HOD credentials can be used in HOD portal.');
        setLoading(false);
        return;
      }
      if (tab === 'student' && user.role !== 'student') {
        showToast('Invalid registration number or student role.');
        setLoading(false);
        return;
      }
      
      login(res.data.token, user);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb blue"></div>
        <div className="login-bg-orb teal"></div>
      </div>

      <Toast {...toast} />

      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-icon">BS</div>
          <div>
            <div className="login-logo-text">BatchSwap</div>
            <div className="login-logo-sub">VIT — CSE Department</div>
          </div>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => { setTab('admin'); setLoginData({ email: '', password: '' }); }}>🔧 Admin</button>
          <button className={`login-tab ${tab === 'hod' ? 'active' : ''}`} onClick={() => { setTab('hod'); setLoginData({ email: '', password: '' }); }}>👨‍💼 HOD</button>
          <button className={`login-tab ${tab === 'student' ? 'active' : ''}`} onClick={() => { setTab('student'); setLoginData({ regNo: '', password: '' }); }}>🎓 Student</button>
        </div>

        {tab === 'admin' ? (
          <div>
            <div className="login-title">Admin Portal</div>
            <div className="login-sub">System administrator access</div>

            <form onSubmit={handleLogin} className="form-fields">
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input className="form-input" type="text" placeholder="admin@vit.ac.in"
                  value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Enter password"
                  value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
              </div>
              
              <button className="btn btn-blue w-full" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div className="test-creds-box">
              <div className="test-creds-title">Admin Credentials</div>
              <div>Admin default: admin@vit.ac.in / admin123</div>
            </div>
          </div>
        ) : tab === 'hod' ? (
          <div>
            <div className="login-title">HOD Portal</div>
            <div className="login-sub">Head of Department access</div>

            <form onSubmit={handleLogin} className="form-fields">
              <div className="form-group">
                <label className="form-label">HOD Email</label>
                <input className="form-input" type="text" placeholder="hod@vit.ac.in"
                  value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Enter password"
                  value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
              </div>
              
              <button className="btn btn-blue w-full" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div className="test-creds-box">
              <div className="test-creds-title">HOD Test Credentials</div>
              <div>Contact admin for credentials</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="login-title">Student Portal</div>
            <div className="login-sub">Student swap requests & tracking</div>

            <form onSubmit={handleLogin} className="form-fields">
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input className="form-input" type="text" placeholder="24BBS0001"
                  value={loginData.regNo} onChange={e => setLoginData({ ...loginData, regNo: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Enter password"
                  value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
              </div>
              
              <button className="btn btn-blue w-full" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div className="test-creds-box">
              <div className="test-creds-title">Sample Student Credentials</div>
              <div>24BBS0158 (Aryan Aman) / Aryan@123</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
