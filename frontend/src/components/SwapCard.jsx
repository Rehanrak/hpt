import React from 'react';

const StatusBadge = ({ status }) => {
  let label = status;
  let cls = 'pending';
  let icon = '⏳';

  if (status === 'pending_partner') {
    label = 'Pending Partner';
    cls = 'warning';
  } else if (status === 'pending_admin') {
    label = 'Pending HOD';
    cls = 'warning';
  } else if (status === 'approved') {
    label = 'HOD Approved';
    cls = 'approved';
    icon = '✓';
  } else if (status === 'rejected_partner') {
    label = 'Partner Rejected';
    cls = 'rejected';
    icon = '✗';
  } else if (status === 'rejected_admin') {
    label = 'HOD Declined';
    cls = 'rejected';
    icon = '✗';
  }

  return (
    <span className={`badge badge-${cls}`}>
      {icon} {label}
    </span>
  );
};

export default function SwapCard({ swap, currentUserId, adminActions, partnerActions }) {
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const isSent = swap.initiator_id === currentUserId;
  const isIncoming = swap.partner_id === currentUserId;

  return (
    <div className="swap-card">
      <div className="swap-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.3rem' }}>🔄</span>
          <span className="swap-card-title">
            Batch Swap Request
          </span>
          {isSent && <span className="swap-type-chip" style={{background: 'rgba(37,99,235,0.15)', color: 'var(--blue-light)', borderColor: 'var(--border)'}}>Sent</span>}
          {isIncoming && <span className="swap-type-chip" style={{background: 'rgba(16,185,129,0.15)', color: 'var(--success)', borderColor: 'var(--border)'}}>Incoming</span>}
        </div>
        <StatusBadge status={swap.status} />
      </div>

      <div className="swap-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initiator</p>
            <p style={{ fontWeight: 600 }}>{swap.initiator_name}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{swap.initiator_reg}</p>
            <p style={{ fontSize: '0.85rem' }}>Batch: <strong style={{color: 'var(--purple-light)'}}>{swap.initiator_batch}</strong></p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partner</p>
            <p style={{ fontWeight: 600 }}>{swap.partner_name}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{swap.partner_reg}</p>
            <p style={{ fontSize: '0.85rem' }}>Batch: <strong style={{color: 'var(--purple-light)'}}>{swap.partner_batch}</strong></p>
          </div>
        </div>
        
        <div className="swap-detail" style={{ marginTop: 8 }}>
          <strong>Reason:</strong>
          <span>{swap.reason}</span>
        </div>
      </div>

      {swap.admin_comment && (
        <div className="admin-comment">
          💬 <strong>HOD Note:</strong> {swap.admin_comment}
        </div>
      )}

      <div className="swap-card-footer">
        <span className="swap-date">Date: {formatDate(swap.created_at)}</span>
        
        <div className="swap-actions">
          {adminActions && adminActions(swap)}
          {partnerActions && isIncoming && swap.status === 'pending_partner' && partnerActions(swap)}
        </div>
      </div>
    </div>
  );
}
