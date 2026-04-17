import React, { useState, useEffect, useCallback } from 'react';
import { getAllSwaps, reviewSwapAdmin } from '../../api';
import SwapCard from '../../components/SwapCard';

export default function ManageRequests() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null); // { swap, action }
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const fetchSwaps = useCallback(() => {
    setLoading(true);
    getAllSwaps(filter === 'all' ? null : filter)
      .then(r => setSwaps(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { fetchSwaps(); }, [fetchSwaps]);

  const handleReview = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      await reviewSwapAdmin(modal.swap.id, { status: modal.action, admin_comment: comment });
      setToast(`Request ${modal.action === 'approved' ? 'Approved' : 'Declined'} successfully!`);
      fetchSwaps();
    } catch (err) {
      setToast(`Error: ${err.response?.data?.message || 'Failed'}`);
    } finally {
      setSubmitting(false);
      setModal(null);
      setComment('');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const adminActions = (swap) => swap.status === 'pending_admin' ? (
    <>
      <button className="btn btn-success btn-sm" onClick={() => setModal({ swap, action: 'approved' })}>✓ Approve</button>
      <button className="btn btn-danger btn-sm" onClick={() => setModal({ swap, action: 'rejected_admin' })}>✗ Decline</button>
    </>
  ) : null;

  return (
    <div>
      {toast && <div className={`toast ${toast.startsWith('Error') ? 'error' : 'success'}`}>{toast}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Swap Requests</h1>
          <p className="page-subtitle">Track and approve/decline batch swap requests between students.</p>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'pending_admin', 'approved', 'rejected_admin'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'all' ? '⊞ All' : f === 'pending_admin' ? '⏳ Pending' : f === 'approved' ? '✅ Approved' : '✗ Declined'}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : swaps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No requests found</h3>
          <p>No swap requests match the current filter.</p>
        </div>
      ) : (
        <div className="swap-list">
          {swaps.map(swap => <SwapCard key={swap.id} swap={swap} adminActions={adminActions} />)}
        </div>
      )}

      {/* Review Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {modal.action === 'approved' ? '✅ Approve' : '✗ Decline'} Swap
              </h3>
              <button className="modal-close" onClick={() => !submitting && setModal(null)}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: 14 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>Swapping Students:</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{modal.swap.initiator_name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{modal.swap.initiator_reg}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--purple-light)'}}>Batch: {modal.swap.initiator_batch}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)'}}>CGPA: {modal.swap.initiator_cgpa}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{modal.swap.partner_name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{modal.swap.partner_reg}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--purple-light)'}}>Batch: {modal.swap.partner_batch}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)'}}>CGPA: {modal.swap.partner_cgpa}</p>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">HOD Remark</label>
                <textarea className="form-textarea" placeholder="Add a comment or internal note for this decision…"
                  value={comment} onChange={e => setComment(e.target.value)} style={{ minHeight: 70 }} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {modal.action === 'approved' ? (
                  <button className="btn btn-success btn-lg" style={{ flex: 1 }}
                    onClick={handleReview} disabled={submitting}>
                    {submitting ? 'Processing…' : '✓ Confirm Approve'}
                  </button>
                ) : (
                  <button className="btn btn-danger btn-lg" style={{ flex: 1 }}
                    onClick={handleReview} disabled={submitting}>
                    {submitting ? 'Processing…' : '✗ Confirm Decline'}
                  </button>
                )}
                <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
