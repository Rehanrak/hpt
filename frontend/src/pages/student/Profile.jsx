import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your personal and academic details.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, color: 'white'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: 4 }}>{user.name}</h2>
            <div className="badge badge-approved" style={{ fontSize: '0.8rem' }}>VIT Student</div>
          </div>
        </div>

        <div className="form-fields">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <div className="form-input" style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}>
                {user.reg_no}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input" style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}>
                {user.email}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Batch</label>
              <div className="form-input" style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}>
                {user.batch}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <div className="form-input" style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}>
                {user.year}nd Year
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CGPA</label>
            <div className="form-input" style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}>
              {user.cgpa?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
