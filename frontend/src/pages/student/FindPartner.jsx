import React, { useState, useEffect } from 'react';
import { getEligiblePartners, submitSwapRequest } from '../../api';

export default function FindPartner({ setActive }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBatch, setFilterBatch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEligiblePartners(filterBatch || null)
      .then(res => setPartners(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch.'))
      .finally(() => setLoading(false));
  }, [filterBatch]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!reason) return setError('Reason is required.');
    setSubmitting(true);
    setError('');
    
    try {
      await submitSwapRequest({ partner_id: selectedPartner.id, reason });
      setSuccess(`Request successfully sent to ${selectedPartner.name}!`);
      setTimeout(() => {
        setSelectedPartner(null);
        setReason('');
        setSuccess('');
        setActive('my-requests');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Swap Partner</h1>
          <p className="page-subtitle">Search for eligible students (Same Year, CGPA diff ≤ 1.0, Different Batch).</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input 
          type="text" 
          placeholder="Filter by specific batch (e.g., CS-B)" 
          className="form-input" 
          style={{ maxWidth: 300 }}
          value={filterBatch}
          onChange={e => setFilterBatch(e.target.value)}
        />
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Name</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id}>
                  <td className="td-primary">{p.reg_no}</td>
                  <td>{p.name}</td>
                  <td><span className="badge badge-pending">{p.batch}</span></td>
                  <td>{p.cgpa?.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedPartner(p)}>
                      Request Swap
                    </button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>No eligible partners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Request */}
      {selectedPartner && (
        <div className="modal-overlay" onClick={() => !submitting && setSelectedPartner(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Send Swap Request</h3>
              <button className="modal-close" onClick={() => !submitting && setSelectedPartner(null)}>×</button>
            </div>

            {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>✗ {error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: 12 }}>✓ {success}</div>}

            <form onSubmit={handleRequest}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: 'var(--text-secondary)' }}>You are requesting a batch swap with:</p>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedPartner.name} ({selectedPartner.reg_no})</p>
                <p style={{ color: 'var(--purple-light)' }}>Target Batch: {selectedPartner.batch}</p>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Reason for Swap</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Explain why you want to swap..."
                  value={reason} onChange={e => setReason(e.target.value)} required
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setSelectedPartner(null)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
