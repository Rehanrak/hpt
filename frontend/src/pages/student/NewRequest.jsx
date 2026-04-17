import React, { useState } from 'react';
import { submitSwapRequest } from '../../api';

export default function NewRequest({ setActive }) {
  const [form, setForm] = useState({ swap_type: 'class', current_val: '', target_val: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const typeConfig = {
    class:  { label: 'Class / Batch', curr: 'Current Batch (e.g. CS-A)', target: 'Requested Batch (e.g. CS-B)' },
    hostel: { label: 'Hostel Room',   curr: 'Current Room (e.g. Block A - 101)', target: 'Requested Room (e.g. Block B - 205)' },
    lab:    { label: 'Lab Section',   curr: 'Current Lab Slot (e.g. L1)', target: 'Requested Lab Slot (e.g. L3)' },
  };

  const config = typeConfig[form.swap_type];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current_val || !form.target_val || !form.reason) {
      return setError('All fields are required.');
    }
    setLoading(true);
    setError('');
    try {
      await submitSwapRequest(form);
      setSuccess('Your swap request has been submitted successfully!');
      setForm({ swap_type: 'class', current_val: '', target_val: '', reason: '' });
      setTimeout(() => setActive('my-requests'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">New Swap Request</h1>
          <p className="page-subtitle">Fill out the form below to request a class, hostel, or lab swap.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600, padding: '32px' }}>
        {success && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, color: 'var(--success)', fontWeight: 500 }}>
            ✓ {success}
          </div>
        )}
        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, color: 'var(--danger)', fontWeight: 500 }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-fields">
          <div className="form-group">
            <label className="form-label">Swap Type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {Object.keys(typeConfig).map(type => (
                <label key={type} style={{ flex: 1 }}>
                  <input type="radio" name="swap_type" value={type} checked={form.swap_type === type}
                    onChange={e => setForm({ ...form, swap_type: e.target.value, current_val: '', target_val: '' })}
                    style={{ display: 'none' }} id={`radio-${type}`} />
                  <div style={{
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                    border: `1px solid ${form.swap_type === type ? 'var(--purple)' : 'var(--border)'}`,
                    background: form.swap_type === type ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: form.swap_type === type ? 'var(--purple-light)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'var(--transition)', fontSize: '0.875rem', fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                    onClick={() => setForm({ ...form, swap_type: type, current_val: '', target_val: '' })}>
                    {type === 'class' ? '🎓' : type === 'hostel' ? '🏠' : '🔬'} {type}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current {config.label}</label>
              <input id="current-val" className="form-input" type="text" placeholder={config.curr}
                value={form.current_val} onChange={e => setForm({ ...form, current_val: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Requested {config.label}</label>
              <input id="target-val" className="form-input" type="text" placeholder={config.target}
                value={form.target_val} onChange={e => setForm({ ...form, target_val: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Swap</label>
            <textarea id="reason" className="form-textarea" placeholder="Please explain why you need this swap (e.g., transport difficulty, health reasons, family issues)…"
              value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required />
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="submit" id="submit-request" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting…' : '→ Submit Request'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setActive('dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
