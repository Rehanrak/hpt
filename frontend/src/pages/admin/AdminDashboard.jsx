import React, { useState, useEffect } from 'react';
import { getAllSwaps, getSwapStats } from '../../api';
import SwapCardAdmin from './SwapCardAdmin';

export default function AdminDashboard({ setActive }) {
  const [stats, setStats] = useState({ pending_admin: 0, approved: 0, rejected: 0, total_students: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    getSwapStats().then(r => setStats(r.data)).catch(console.error);
    getAllSwaps('pending_admin').then(r => setRecent(r.data.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Admin Dashboard</div>
          <div className="page-sub">Overview of all swap activities</div>
        </div>
      </div>

      <div className="storage-info-box">
        <div className="storage-info-left">
          <span className="storage-info-icon">💾</span>
          <div className="storage-info-text">
            <strong>Offline Storage Active</strong> — All data (requests, notifications, audit log, batch changes) is permanently saved to your PC's browser storage. It survives closing the file, rebooting, or refreshing. Only deleted if you click "Reset All Data" or clear browser storage. · <strong>4.4 KB used</strong>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Key: bsms_vit_data_v1</div>
      </div>

      <div className="stats-grid">
        <div className="adm-stat-card amber">
          <div className="stat-label-2">Pending HOD Review</div>
          <div className="stat-val-2">{stats?.pending_admin}</div>
        </div>
        <div className="adm-stat-card teal">
          <div className="stat-label-2">Total Approved</div>
          <div className="stat-val-2">{stats?.approved}</div>
        </div>
        <div className="adm-stat-card red">
          <div className="stat-label-2">Total Declined</div>
          <div className="stat-val-2">{stats?.rejected}</div>
        </div>
        <div className="adm-stat-card blue">
          <div className="stat-label-2">Total Students</div>
          <div className="stat-val-2">{stats?.total_students}</div>
        </div>
      </div>

      <div className="section-title">Quick Actions — Pending Requests</div>

      {recent.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div className="empty-state-icon">✅</div>
          <h3>All Clear!</h3>
          <p>No pending swap requests requiring your approval at the moment.</p>
        </div>
      ) : (
        <div className="swap-list">
          {recent.map(swap => (
             <SwapCardAdmin key={swap.id} swap={swap} adminActions />
          ))}
        </div>
      )}
    </div>
  );
}
