import React, { useState, useEffect } from 'react';
import { getAllSwaps, getSwapStats } from '../../api';
import SwapCard from '../../components/SwapCard';

const StatCard = ({ icon, label, value, cls }) => (
  <div className={`stat-card ${cls}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value ?? '—'}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default function AdminDashboard({ setActive }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    getSwapStats().then(r => setStats(r.data)).catch(console.error);
    getAllSwaps('pending_admin').then(r => setRecent(r.data.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">HOD Dashboard</h1>
          <p className="page-subtitle">Overview of all operations and pending swap approvals.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="👥" label="Total Students" value={stats?.total_students} cls="purple" />
        <StatCard icon="⏳" label="Pending HOD"    value={stats?.pending_admin} cls="warning" />
        <StatCard icon="✅" label="Approved Swaps" value={stats?.approved} cls="success" />
        <StatCard icon="✗" label="Declined Swaps" value={stats?.rejected} cls="danger" />
      </div>

      <div className="workflow-grid" style={{ marginBottom: 24 }}>
        <div className="workflow-step">
          <div className="workflow-step-header">
            <span className="workflow-step-icon">1</span>
            <h3>Student Request</h3>
          </div>
          <p>Student submits swap request and partner either accepts or rejects it.</p>
        </div>
        <div className="workflow-step">
          <div className="workflow-step-header">
            <span className="workflow-step-icon">2</span>
            <h3>Admin Verification</h3>
          </div>
          <p>Review students, their batches and CGPA, and add an optional HOD remark.</p>
        </div>
        <div className="workflow-step">
          <div className="workflow-step-header">
            <span className="workflow-step-icon">3</span>
            <h3>Finalize Swap</h3>
          </div>
          <p>Approved requests complete the batch exchange for both students.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Recently Pending (Awaiting Approval)</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => setActive('all-requests')}>View All Pending →</button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h3>All Clear!</h3>
          <p>No pending swap requests requiring your approval at the moment.</p>
        </div>
      ) : (
        <div className="swap-list">
          {recent.map(swap => (
            <SwapCard key={swap.id} swap={swap} />
          ))}
        </div>
      )}
    </div>
  );
}
