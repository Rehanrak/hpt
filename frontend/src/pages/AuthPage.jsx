import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

const Toast = ({ message, type }) =>
  message ? <div className={`toast ${type}`}>{type === 'error' ? '✗' : '✓'} {message}</div> : null;

export default function AuthPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Login form (accepts email or registration number as "email")
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  // Register form for new schema (batch swap specific)
  const [regData, setRegData] = useState({ name: '', email: '', password: '', reg_no: '', batch: '', cgpa: '', year: '3' });

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(loginData);
      login(res.data.token, res.data.user);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password || !regData.reg_no || !regData.batch || !regData.cgpa || !regData.year) {
      return showToast('All fields are required.');
    }
    setLoading(true);
    try {
      await registerUser({ ...regData, cgpa: parseFloat(regData.cgpa), year: parseInt(regData.year, 10) });
      showToast('Registration successful! Please log in.', 'success');
      setTab('login');
      setLoginData({ email: regData.reg_no, password: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toast {...toast} />
      <div className="auth-container">
        <div className="auth-logo">
          <h1>⇄ BatchSwap</h1>
          <p>VIT CSE Department Swap Management System</p>
        </div>

        <div className="card auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="form-fields">
              <div className="form-group">
                <label className="form-label">Email or Reg No (Student) / Email (Admin)</label>
                <input className="form-input" type="text" placeholder="e.g. 21BCE001"
                  value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Enter your password"
                  value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
              </div>
              <div className="divider">Admin default: admin@vit.ac.in / admin123</div>
              <div className="divider" style={{marginTop: -4}}>Student default: 21BCE001 / password123</div>
              <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : '→ Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="form-fields">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" placeholder="John Doe"
                  value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} required />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Registration No.</label>
                  <input className="form-input" type="text" placeholder="e.g. 21BCE001" maxLength="8"
                    value={regData.reg_no} onChange={e => setRegData({ ...regData, reg_no: e.target.value.toUpperCase() })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Batch</label>
                  <input className="form-input" type="text" placeholder="e.g. CS-A"
                    value={regData.batch} onChange={e => setRegData({ ...regData, batch: e.target.value })} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CGPA</label>
                  <input className="form-input" type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.5"
                    value={regData.cgpa} onChange={e => setRegData({ ...regData, cgpa: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select className="form-select" value={regData.year} onChange={e => setRegData({ ...regData, year: e.target.value })}>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">VIT Email Address</label>
                <input className="form-input" type="email" placeholder="student@vit.ac.in"
                  value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Min. 6 characters"
                  value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} required />
              </div>
              <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={loading}>
                {loading ? 'Creating Account…' : '→ Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
