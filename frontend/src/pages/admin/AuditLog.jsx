import React, { useState, useEffect } from 'react';
import { getAuditLog } from '../../api';
import { exportToCSV, transformAuditLogForCSV } from '../../utils/csvExport';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAuditLog()
      .then(res => {
        console.log('Audit log data:', res.data);
        setLogs(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch audit log:', err.message);
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert('No audit log data to export');
      return;
    }
    const csvData = transformAuditLogForCSV(logs);
    exportToCSV(csvData, 'audit-log');
  };

  return (
    <div>
      <div className="page-header-row">
        <div className="page-header">
          <div className="page-title">Audit Log</div>
          <div className="page-sub">Complete permanent history of all HOD decisions</div>
        </div>
        <button onClick={handleExportCSV} className="btn btn-ghost btn-sm" style={{ padding: "7px 14px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", borderRadius: "var(--radius-sm)" }}>⬇ Export CSV</button>
      </div>

      <div style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#4ade80' }}>
        🔒 All HOD decisions (approvals & rejections) are permanently recorded. Total records: <strong>{logs.length}</strong>
      </div>

      {loading ? <div className="spinner" /> : (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Req ID</th>
              <th>Student A</th>
              <th>Slot A</th>
              <th>Student B</th>
              <th>Slot B</th>
              <th>Batch Swap</th>
              <th>Action</th>
              <th>HOD Remark</th>
              <th>Date &amp; Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No decisions recorded yet.
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                
                const getActionBadge = (status) => {
                  if (status === 'approved') {
                    return <span style={{background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 8px', borderRadius: 3, fontWeight: 600}}>✓ Approved</span>;
                  } else if (status === 'rejected_admin') {
                    return <span style={{background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '3px 8px', borderRadius: 3, fontWeight: 600}}>✗ Rejected</span>;
                  }
                  return status;
                };
                
                return (
                  <tr key={log.id}>
                    <td><strong>#{log.id}</strong></td>
                    <td>
                      <div><strong>{log.initiator_name}</strong></div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{log.initiator_reg}</div>
                    </td>
                    <td><span style={{background: 'rgba(168,85,247,0.15)', color: '#a78bfa', padding: '2px 6px', borderRadius: 3, fontWeight: 600}}>{log.initiator_slot || 'N/A'}</span></td>
                    <td>
                      <div><strong>{log.partner_name}</strong></div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{log.partner_reg}</div>
                    </td>
                    <td><span style={{background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: 3, fontWeight: 600}}>{log.partner_slot || 'N/A'}</span></td>
                    <td><span style={{fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 3}}>
                      {log.initiator_batch} ⇌ {log.partner_batch}
                    </span></td>
                    <td>{getActionBadge(log.status)}</td>
                    <td><em style={{color: 'var(--text-secondary)'}}>{log.admin_comment || '-'}</em></td>
                    <td style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{formatDate(log.updated_at)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
