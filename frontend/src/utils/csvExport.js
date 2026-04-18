// CSV Export Utility

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get all keys from first object
  const keys = Object.keys(data[0]);
  
  // Create CSV header
  const headers = keys.map(key => `"${key}"`).join(',');
  
  // Create CSV rows
  const rows = data.map(obj => {
    return keys.map(key => {
      const value = obj[key];
      // Handle null/undefined
      if (value === null || value === undefined) return '""';
      // Handle dates
      if (value instanceof Date) return `"${value.toLocaleDateString('en-IN')}"`;
      // Handle strings with commas or quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      // Handle numbers and booleans
      return `"${value}"`;
    }).join(',');
  }).join('\n');

  // Combine header and rows
  const csv = `${headers}\n${rows}`;
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to transform data for better CSV readability
export const transformAuditLogForCSV = (logs) => {
  return logs.map(log => ({
    'Request ID': log.id,
    'Student A Name': log.initiator_name,
    'Student A Reg': log.initiator_reg,
    'Student A Batch': log.initiator_batch,
    'Student B Name': log.partner_name,
    'Student B Reg': log.partner_reg,
    'Student B Batch': log.partner_batch,
    'Action': log.status === 'approved' ? 'Approved' : log.status === 'rejected_admin' ? 'Rejected' : log.status,
    'HOD Remark': log.admin_comment || '-',
    'Date': new Date(log.updated_at).toLocaleDateString('en-IN'),
    'Time': new Date(log.updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }));
};

export const transformBatchRecordsForCSV = (students) => {
  return students.map(s => ({
    'Name': s.name,
    'Registration Number': s.reg_no,
    'CGPA': s.cgpa?.toFixed(1) || '-',
    'Current Batch': s.batch || '-',
    'Section': s.section || '-',
    'Slot': s.slot || '-',
    'Year': s.year || '-'
  }));
};

export const transformUsersForCSV = (users) => {
  return users.map(u => ({
    'Name': u.name,
    'Email': u.email,
    'Role': u.role.toUpperCase(),
    'Registration Number': u.reg_no || '-',
    'Batch': u.batch || '-',
    'CGPA': u.cgpa?.toFixed(1) || '-',
    'Year': u.year || '-',
    'Created Date': new Date(u.created_at).toLocaleDateString('en-IN')
  }));
};

export const transformSwapRequestsForCSV = (requests) => {
  return requests.map(req => ({
    'Request ID': req.id,
    'Initiator': req.initiator_name,
    'Initiator Reg': req.initiator_reg,
    'Initiator Batch': req.initiator_batch,
    'Partner': req.partner_name,
    'Partner Reg': req.partner_reg,
    'Partner Batch': req.partner_batch,
    'Status': req.status,
    'Reason': req.reason || '-',
    'Date': new Date(req.created_at).toLocaleDateString('en-IN')
  }));
};
