import React, { useState, useEffect } from 'react';
import { getAllStudents } from '../../api';
import { exportToCSV, transformBatchRecordsForCSV } from '../../utils/csvExport';

export default function BatchRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');

  useEffect(() => {
    getAllStudents()
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('No batch records to export');
      return;
    }
    const csvData = transformBatchRecordsForCSV(students);
    exportToCSV(csvData, 'batch-records');
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.reg_no.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = batchFilter ? s.batch === batchFilter : true;
    return matchesSearch && matchesBatch;
  });

  return (
    <div>
      <div className="page-header-row">
        <div className="page-header">
          <div className="page-title">Batch Records</div>
          <div className="page-sub">All 54 students and their current batch assignments</div>
        </div>
        <button onClick={handleExportCSV} className="btn btn-ghost btn-sm" style={{ padding: "7px 14px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", borderRadius: "var(--radius-sm)" }}>⬇ Export CSV</button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input 
            className="form-input" 
            type="text" 
            placeholder="Search by name or reg no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="form-input form-select" 
          style={{ width: 'auto', paddingRight: 40 }}
          value={batchFilter}
          onChange={e => setBatchFilter(e.target.value)}
        >
          <option value="">All Batches</option>
          <option value="A1">A1</option><option value="A2">A2</option>
          <option value="B1">B1</option><option value="B2">B2</option>
          <option value="C1">C1</option><option value="C2">C2</option>
        </select>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg No</th>
                <th>CGPA</th>
                <th>Batch</th>
                <th>Section</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.reg_no}</td>
                  <td>{s.cgpa?.toFixed(1) || s.cgpa}</td>
                  <td>
                    <span className={`batch-chip ${s.batch?.[0] === 'B' || s.batch?.[0] === 'C' ? 'batch-chip-to' : 'batch-chip-from'}`}>
                      {s.batch}
                    </span>
                  </td>
                  <td>CSE-{s.batch?.[0] || 'A'}</td>
                  <td>{s.year || 1}</td>
                  <td>
                    <span style={{ color: '#4ade80', background: 'rgba(74,222,128,0.12)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: '1px solid rgba(74,222,128,0.3)' }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', marginRight: 4 }}></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No batch records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
