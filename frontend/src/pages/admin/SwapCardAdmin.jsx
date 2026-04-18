import React, { useState } from 'react';

export default function SwapCardAdmin({ swap, onReview }) {
  const [remark, setRemark] = useState('');

  // Default mock data if the swap object is missing properties
  const s = {
    id: swap?.id || 2,
    date: swap?.date || '17 Apr 2026, 04:52 pm',
    status: swap?.status || 'pending_admin',
    reason: swap?.reason || 'gate',
    initiator_name: swap?.initiator_name || 'Rehan Khan',
    initiator_reg: swap?.initiator_reg || '24BBS0234',
    initiator_batch: swap?.initiator_batch || 'C1',
    initiator_slot: swap?.initiator_slot || 'Slot-4',
    initiator_cgpa: swap?.initiator_cgpa || '7.8',
    partner_name: swap?.partner_name || 'Atharv Agarwal',
    partner_reg: swap?.partner_reg || '24BBS0194',
    partner_batch: swap?.partner_batch || 'B1',
    partner_slot: swap?.partner_slot || 'Slot-2',
    partner_cgpa: swap?.partner_cgpa || '7.5',
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Request #{s.id}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.date}</div>
        </div>
        <div style={{ background: 'rgba(124, 58, 237, 0.15)', color: 'var(--purple-light)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-light)', marginRight: 6 }}></span>
          HOD Review
        </div>
      </div>

      <div className="req-swap-arrow" style={{ background: 'transparent', padding: 0, paddingBottom: 16 }}>
        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>📍 {s.initiator_name}</div>
          <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>{s.initiator_reg}</div>
          <div style={{display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap'}}>
            <span className="batch-chip batch-chip-from">Batch {s.initiator_batch}</span>
            <span style={{ fontSize: '0.8rem', background: 'rgba(168,85,247,0.15)', color: '#a78bfa', padding: '3px 8px', borderRadius: 4 }}>Slot: <strong>{s.initiator_slot}</strong></span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>CGPA <strong>{s.initiator_cgpa}</strong></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', margin: '0 8px' }}>
          <span style={{ fontSize: 24, color: '#4f8ef7', lineHeight: 1 }}>⇌</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>SWAP</span>
        </div>

        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>🎯 {s.partner_name}</div>
          <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>{s.partner_reg}</div>
          <div style={{display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap'}}>
            <span className="batch-chip batch-chip-to">Batch {s.partner_batch}</span>
            <span style={{ fontSize: '0.8rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '3px 8px', borderRadius: 4 }}>Slot: <strong>{s.partner_slot}</strong></span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>CGPA <strong>{s.partner_cgpa}</strong></div>
        </div>
      </div>

      <div className="reason-text">
        📄 Student reason: "{s.reason}"
      </div>

      {s.status === 'pending_admin' && onReview && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>HOD Remark (required)</div>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Enter your remark..." 
            value={remark} 
            onChange={(e) => setRemark(e.target.value)}
            style={{ marginBottom: 16, background: 'rgba(255,255,255,0.02)' }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-success" onClick={() => onReview(s.id, 'approved', remark)}>
              ✓ Approve Swap
            </button>
            <button className="btn btn-danger" onClick={() => onReview(s.id, 'rejected_admin', remark)} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              ✗ Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
