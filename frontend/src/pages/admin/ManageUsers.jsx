import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { exportToCSV, transformUsersForCSV } from '../../utils/csvExport';

const API_BASE = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE });

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    reg_no: '',
    batch: '',
    slot: '',
    section: '',
    cgpa: '',
    year: ''
  });

  const fetchUsers = () => {
    setLoading(true);
    api.get('/swaps/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => {
        setToast(`Error loading users: ${err.response?.data?.message || err.message}`);
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setToast('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        reg_no: formData.reg_no || undefined,
        batch: formData.batch || undefined,
        slot: formData.slot || undefined,
        section: formData.section || undefined,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined,
        year: formData.year ? parseInt(formData.year) : undefined
      };

      await api.post('/swaps/admin/users', payload);
      setToast('User added successfully!');
      setFormData({
        name: '', email: '', password: '', role: 'student',
        reg_no: '', batch: '', slot: '', section: '', cgpa: '', year: ''
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setToast(`Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) {
      setToast('No users to export');
      return;
    }
    const csvData = transformUsersForCSV(users);
    exportToCSV(csvData, 'users');
    setToast('Users exported successfully!');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.reg_no && u.reg_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (role) => {
    const styles = {
      admin: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: '🔧 Admin' },
      hod: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: '👨‍💼 HOD' },
      student: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: '🎓 Student' }
    };
    const style = styles[role] || styles.student;
    return <span style={{background: style.bg, color: style.color, padding: '3px 8px', borderRadius: 3, fontWeight: 600, fontSize: '0.85rem'}}>{style.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Manage Users</div>
          <div className="page-sub">Add and view all system users</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleExportCSV} className="btn btn-ghost btn-sm" style={{ padding: "7px 14px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", borderRadius: "var(--radius-sm)" }}>⬇ Export CSV</button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕ Cancel' : '+ Add New User'}
          </button>
        </div>
      </div>

      {toast && (
        <div style={{background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#10b981'}}>
          {toast}
        </div>
      )}

      {showAddForm && (
        <div style={{background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-sm)', padding: 20, marginBottom: 20}}>
          <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: 15}}>Add New User</div>
          <form onSubmit={handleAddUser}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16}}>
              <div>
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" placeholder="John Doe"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="user@vit.ac.in"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" placeholder="Enter password"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div>
                <label className="form-label">Role *</label>
                <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required>
                  <option value="student">🎓 Student</option>
                  <option value="hod">👨‍💼 HOD</option>
                  <option value="admin">🔧 Admin</option>
                </select>
              </div>
              
              {formData.role === 'student' && (
                <>
                  <div>
                    <label className="form-label">Registration Number</label>
                    <input className="form-input" type="text" placeholder="24BBS0001"
                      value={formData.reg_no} onChange={e => setFormData({...formData, reg_no: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Batch</label>
                    <input className="form-input" type="text" placeholder="A1"
                      value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Slot</label>
                    <input className="form-input" type="text" placeholder="Slot-1"
                      value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Section</label>
                    <input className="form-input" type="text" placeholder="CSE-A"
                      value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">CGPA</label>
                    <input className="form-input" type="number" step="0.1" placeholder="8.5"
                      value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Year</label>
                    <input className="form-input" type="number" placeholder="1"
                      value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn btn-primary">✓ Add User</button>
          </form>
        </div>
      )}

      <div style={{marginBottom: 16}}>
        <input className="form-input" type="text" placeholder="Search by name, email, or reg number…"
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Reg No</th>
                <th>Batch</th>
                <th>Slot</th>
                <th>Section</th>
                <th>CGPA</th>
                <th>Year</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td style={{fontSize: '0.9rem'}}>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td style={{fontSize: '0.9rem'}}>{user.reg_no || '-'}</td>
                    <td style={{fontSize: '0.9rem'}}>{user.batch || '-'}</td>
                    <td style={{fontSize: '0.9rem'}}>{user.slot || '-'}</td>
                    <td style={{fontSize: '0.9rem'}}>{user.section || '-'}</td>
                    <td style={{fontSize: '0.9rem'}}>{user.cgpa || '-'}</td>
                    <td style={{fontSize: '0.9rem'}}>{user.year || '-'}</td>
                    <td style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                      {new Date(user.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
