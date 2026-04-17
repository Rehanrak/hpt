import React, { useState, useEffect } from 'react';
import { getAllStudents } from '../../api';

export default function BatchRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllStudents()
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.reg_no.toLowerCase().includes(search.toLowerCase()) ||
    s.batch.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Register Number', 'Name', 'Email', 'Batch', 'CGPA', 'Year'];
    const csvContent = [
      headers.join(','),
      ...filtered.map(s => `"${s.reg_no}","${s.name}","${s.email}","${s.batch}",${s.cgpa},${s.year}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'VIT_CSE_Batch_Records.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Batch Records</h1>
          <p className="page-subtitle">Directory of all VIT CSE students registered in the system.</p>
        </div>
        <button className="btn btn-success" onClick={exportCSV}>
          ⬇ Export to CSV
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input 
          type="text" 
          placeholder="Search by Name, Reg No, or Batch…" 
          className="form-input" 
          style={{ maxWidth: 400 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Full Name</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Year</th>
                <th>Email Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="td-primary">{s.reg_no}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td><span className="badge badge-approved" style={{ background: 'rgba(124, 58, 237, 0.15)', color: 'var(--purple-light)', borderColor: 'rgba(124, 58, 237, 0.3)' }}>{s.batch}</span></td>
                  <td>{s.cgpa?.toFixed(2)}</td>
                  <td>{s.year}</td>
                  <td>{s.email}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>No registered students found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
