import React, { useState, useEffect } from 'react';
import { getMySwaps, respondToPartnerRequest } from '../../api';
import { useAuth } from '../../context/AuthContext';
import SwapCard from '../../components/SwapCard';

export default function MyRequests() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('sent'); // 'sent' | 'incoming'
  const [processId, setProcessId] = useState(null);
  
  const fetchSwaps = () => {
    setLoading(true);
    getMySwaps()
      .then(res => setSwaps(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handlePartnerResponse = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    setProcessId(id);
    try {
      await respondToPartnerRequest(id, { action });
      fetchSwaps();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request.');
    } finally {
      setProcessId(null);
    }
  };

  const partnerActions = (swap) => (
    <>
      <button className="btn btn-success btn-sm" disabled={processId === swap.id}
        onClick={() => handlePartnerResponse(swap.id, 'accept')}>
        ✓ Accept
      </button>
      <button className="btn btn-danger btn-sm" disabled={processId === swap.id}
        onClick={() => handlePartnerResponse(swap.id, 'reject')}>
        ✗ Reject
      </button>
    </>
  );

  const filtered = swaps.filter(s => tab === 'sent' ? s.initiator_id === user.id : s.partner_id === user.id);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Swap Requests</h1>
          <p className="page-subtitle">Track requests you have sent and received.</p>
        </div>
      </div>

      <div className="auth-tabs" style={{ maxWidth: 400 }}>
        <button className={`auth-tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
          ↗ Sent ({swaps.filter(s => s.initiator_id === user.id).length})
        </button>
        <button className={`auth-tab ${tab === 'incoming' ? 'active' : ''}`} onClick={() => setTab('incoming')}>
          ↙ Incoming ({swaps.filter(s => s.partner_id === user.id).length})
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No {tab} requests</h3>
          <p>You haven't {tab === 'sent' ? 'sent' : 'received'} any swap requests yet.</p>
        </div>
      ) : (
        <div className="swap-list">
          {filtered.map(swap => (
            <SwapCard key={swap.id} swap={swap} currentUserId={user.id} partnerActions={partnerActions} />
          ))}
        </div>
      )}
    </div>
  );
}
