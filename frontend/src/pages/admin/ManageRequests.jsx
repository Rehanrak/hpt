import React, { useState, useEffect, useCallback } from 'react';
import { getAllSwaps, reviewSwapAdmin } from '../../api';
import { exportToCSV, transformSwapRequestsForCSV } from '../../utils/csvExport';
import SwapCardAdmin from './SwapCardAdmin';

export default function ManageRequests() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const fetchSwaps = useCallback(() => {
    setLoading(true);
    getAllSwaps('pending_admin')
      .then(r => setSwaps(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSwaps(); }, [fetchSwaps]);

  const handleReview = async (id, action, comment) => {
    try {
      await reviewSwapAdmin(id, { status: action, admin_comment: comment });
      setToast(`Request ${action === 'approved' ? 'Approved' : 'Declined'} successfully!`);
      fetchSwaps();
    } catch (err) {
      setToast(`Error: ${err.response?.data?.message || 'Failed'}`);
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleExportCSV = () => {
    if (swaps.length === 0) {
      setToast('No swap requests to export');
      return;
    }
    const csvData = transformSwapRequestsForCSV(swaps);
    exportToCSV(csvData, 'swap-requests');
    setToast('Swap requests exported successfully!');
  };

  return (
    <div>
      {toast && <div className={`toast ${toast.startsWith('Error') ? 'error' : 'success'}`}>{toast}</div>}

      <div className="page-header">
        <div>
          <div className="page-title">Pending Requests</div>
          <div className="page-sub">Swap requests awaiting your decision</div>
        </div>
        <button onClick={handleExportCSV} className="btn btn-ghost btn-sm" style={{ padding: "7px 14px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", borderRadius: "var(--radius-sm)" }}>⬇ Export CSV</button>
      </div>

      {loading ? <div className="spinner" /> : swaps.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div className="empty-state-icon">📭</div>
          <h3>No requests found</h3>
          <p>You have no pending requests at the moment.</p>
        </div>
      ) : (
        <div className="swap-list">
          {swaps.map(swap => (
            <SwapCardAdmin 
              key={swap.id} 
              swap={swap} 
              onReview={handleReview} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
