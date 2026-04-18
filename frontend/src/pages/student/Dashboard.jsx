import React, { useState, useEffect } from 'react';
import { getMySwaps, getNotifications } from '../../api';
import { useAuth } from '../../context/AuthContext';
import SwapCard from '../../components/SwapCard';

export default function StudentDashboard({ setActive }) {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getMySwaps()
      .then(res => setSwaps(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
      
    getNotifications().then(res => setNotifications(res.data)).catch(console.error);
  }, []);

  const stats = {
    active: swaps.filter(s => s.initiator_id === user.id && (s.status === 'pending_partner' || s.status === 'pending_admin')).length,
    incoming: swaps.filter(s => s.partner_id === user.id && s.status === 'pending_partner').length,
    pendingHOD: swaps.filter(s => s.status === 'pending_admin').length,
    completed: swaps.filter(s => s.status === 'approved').length,
  };

  const recentSwaps = swaps.slice(0, 3);
  const unreadNotifs = notifications.filter(n => !n.is_read).length;
  const flow = {
    sentToPartner: swaps.filter(s => s.initiator_id === user.id && s.status === 'pending_partner').length,
    pendingHod: swaps.filter(s => s.initiator_id === user.id && s.status === 'pending_admin').length,
    completed: swaps.filter(s => s.initiator_id === user.id && s.status === 'approved').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to your student portal, {user?.name}.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActive('find-partner')}>
          🔍 Find Partner
        </button>
      </div>

      {unreadNotifs > 0 && (
        <div style={{ background: 'var(--purple)', color: 'white', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>📬 New Notifications!</strong> You have {unreadNotifs} unread updates.</span>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">↗</div>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Sent Req.</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">↙</div>
          <div className="stat-value">{stats.incoming}</div>
          <div className="stat-label">Action Needed</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendingHOD}</div>
          <div className="stat-label">Pending HOD</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="workflow-grid" style={{ marginBottom: 24 }}>
        <div className="workflow-step">
          <div className="workflow-step-header">
            <span className="workflow-step-icon">1</span>
            <h3>Send Request</h3>
          </div>
          <p>Find an eligible partner and create a swap request with your reason.</p>
          <div className="workflow-step-meta">{flow.sentToPartner} waiting for partner response</div>
        </div>
        <div className="workflow-step">
          <div className="workflow-step-header">
            <span className="workflow-step-icon">2</span>
            <h3>Partner Review</h3>
          </div>
          <p>Partner accepts/rejects. Accepted requests move to HOD approval stage.</p>
          <div className="workflow-step-meta">{flow.pendingHod} awaiting HOD decision</div>
        </div>
        <div className="workflow-step">
          <div className="workflow-step-header">
            <span className="workflow-step-icon">3</span>
            <h3>HOD Final Approval</h3>
          </div>
          <p>On approval, both students’ batches are swapped automatically.</p>
          <div className="workflow-step-meta">{flow.completed} completed for you</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Recent Activity</h3>
            {swaps.length > 3 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setActive('my-requests')}>View All →</button>
            )}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : recentSwaps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No Activity</h3>
            </div>
          ) : (
            <div className="swap-list">
              {recentSwaps.map(swap => <SwapCard key={swap.id} swap={swap} currentUserId={user.id} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
