const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, requireAdmin, requireAdminOrHOD } = require('../middleware/auth');

// Helper to send notification
function notify(userId, message) {
  db.run(`INSERT INTO notifications (user_id, message) VALUES (?, ?)`, [userId, message]);
}

// GET /api/swaps/eligible - Find eligible partners
router.get('/eligible', authenticateToken, (req, res) => {
  const { batch } = req.query; // optional filter
  
  db.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], (err, currentStudent) => {
    if (err || !currentStudent) return res.status(500).json({ message: 'Server error.' });
    
    // Eligible: same year, diff batch, cgpa diff <= 1.0
    let query = `
      SELECT id, name, reg_no, batch, slot, section, cgpa, year 
      FROM users 
      WHERE role = 'student' 
      AND id != ? 
      AND year = ? 
      AND batch != ? 
      AND ABS(cgpa - ?) <= 1.0
    `;
    const params = [currentStudent.id, currentStudent.year, currentStudent.batch, currentStudent.cgpa];
    
    if (batch) {
        query += ` AND batch = ?`;
        params.push(batch);
    }
    
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error.', error: err.message });
        res.json(rows);
    });
  });
});

// POST /api/swaps/request - Send 2-way swap request
router.post('/request', authenticateToken, (req, res) => {
  const { partner_id, reason } = req.body;
  const initiator_id = req.user.id;

  if (!partner_id || !reason) {
    return res.status(400).json({ message: 'Partner and reason are required.' });
  }

  // Check if they already have an active request
  db.get(
    `SELECT id FROM swap_requests 
     WHERE (initiator_id = ? AND partner_id = ? AND status NOT IN ('rejected_partner', 'rejected_admin'))`,
    [initiator_id, partner_id],
    (err, existing) => {
      if (existing) return res.status(400).json({ message: 'Active request already exists between you two.' });

      db.run(
        `INSERT INTO swap_requests (initiator_id, partner_id, status, reason) VALUES (?, ?, 'pending_partner', ?)`,
        [initiator_id, partner_id, reason],
        function (err) {
          if (err) return res.status(500).json({ message: 'Failed to submit request.', error: err.message });
          
          notify(partner_id, `You have a new swap request from ${req.user.name}.`);
          res.status(201).json({ message: 'Swap request sent to partner.', id: this.lastID });
        }
      );
    }
  );
});

// GET /api/swaps/me - Get sent and received requests
router.get('/me', authenticateToken, (req, res) => {
    const query = `
      SELECT sr.*, 
             i.name as initiator_name, i.batch as initiator_batch, i.reg_no as initiator_reg,
             p.name as partner_name, p.batch as partner_batch, p.reg_no as partner_reg
      FROM swap_requests sr
      JOIN users i ON sr.initiator_id = i.id
      JOIN users p ON sr.partner_id = p.id
      WHERE sr.initiator_id = ? OR sr.partner_id = ?
      ORDER BY sr.created_at DESC
    `;
    db.all(query, [req.user.id, req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Server error.', error: err.message });
      res.json(rows);
    });
});

// PUT /api/swaps/:id/partner - Partner accepts/rejects
router.put('/:id/partner', authenticateToken, (req, res) => {
    const { action } = req.body; // 'accept' or 'reject'
    const { id } = req.params;
    const partner_id = req.user.id;

    if (!['accept', 'reject'].includes(action)) return res.status(400).json({ message: 'Invalid action.' });

    const newStatus = action === 'accept' ? 'pending_admin' : 'rejected_partner';

    db.run(
        `UPDATE swap_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND partner_id = ? AND status = 'pending_partner'`,
        [newStatus, id, partner_id],
        function (err) {
            if (err) return res.status(500).json({ message: 'Update failed.' });
            if (this.changes === 0) return res.status(404).json({ message: 'Request not found or not pending.' });
            
            db.get(`SELECT initiator_id FROM swap_requests WHERE id = ?`, [id], (err, swap) => {
                if (swap) {
                    notify(swap.initiator_id, `Your swap request was ${action}ed by your partner.`);
                }
            });
            res.json({ message: `Request ${newStatus}.` });
        }
    );
});

// POST /api/swaps/admin/users - Create a new user (Admin only)
router.post('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    const { name, email, password, role, reg_no, batch, cgpa, year, slot, section } = req.body;
    
    console.log('POST /admin/users called with:', { name, email, role });
    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }
    
    if (!['student', 'hod', 'faculty_coordinator'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be student, hod, or faculty_coordinator.' });
    }
    
    try {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            `INSERT INTO users (name, email, password, role, reg_no, batch, cgpa, year, slot, section) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, role, reg_no || null, batch || null, cgpa || null, year || null, slot || null, section || null],
            function(err) {
                if (err) {
                    console.error('DB Insert Error:', err);
                    if (err.message.includes('UNIQUE constraint failed: users.email')) {
                        return res.status(409).json({ message: 'Email already exists.' });
                    }
                    if (err.message.includes('UNIQUE constraint failed: users.reg_no')) {
                        return res.status(409).json({ message: 'Registration number already exists.' });
                    }
                    return res.status(500).json({ message: 'Server error.', error: err.message });
                }
                console.log('User created:', name, email);
                res.status(201).json({ message: 'User created successfully.', id: this.lastID });
            }
        );
    } catch (err) {
        console.error('Bcrypt/Route Error:', err);
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
});

// GET /api/swaps/admin/users - Get all users (Admin only)
router.get('/admin/users', authenticateToken, requireAdmin, (req, res) => {
    db.all(
        `SELECT id, name, email, role, reg_no, batch, slot, section, cgpa, year, created_at FROM users ORDER BY created_at DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Server error.', error: err.message });
            res.json(rows || []);
        }
    );
});

// GET /api/swaps/admin - Admin/HOD view requests
router.get('/admin', authenticateToken, requireAdminOrHOD, (req, res) => {
    const { status } = req.query;
    let query = `
      SELECT sr.*, 
             i.name as initiator_name, i.batch as initiator_batch, i.reg_no as initiator_reg, i.cgpa as initiator_cgpa,
             p.name as partner_name, p.batch as partner_batch, p.reg_no as partner_reg, p.cgpa as partner_cgpa
      FROM swap_requests sr
      JOIN users i ON sr.initiator_id = i.id
      JOIN users p ON sr.partner_id = p.id
    `;
    const params = [];
    if (status) {
        query += ` WHERE sr.status = ?`;
        params.push(status);
    }
    query += ` ORDER BY sr.created_at DESC`;

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error.', error: err.message });
        res.json(rows);
    });
});

// PUT /api/swaps/:id/admin - Admin/HOD accepts/rejects
router.put('/:id/admin', authenticateToken, requireAdminOrHOD, (req, res) => {
    const { status, admin_comment } = req.body; // 'approved' or 'rejected_admin'
    const { id } = req.params;

    if (!['approved', 'rejected_admin'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    db.run(
        `UPDATE swap_requests SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending_admin'`,
        [status, admin_comment || null, id],
        function (err) {
            if (err) return res.status(500).json({ message: 'Update failed.' });
            if (this.changes === 0) return res.status(404).json({ message: 'Request not found or not pending admin.' });
            
            // Notifications & actual batch swap logic (if approved, we'd swap their batches here)
            db.get(`SELECT initiator_id, partner_id FROM swap_requests WHERE id = ?`, [id], (err, swap) => {
                if (swap) {
                    notify(swap.initiator_id, `HOD has ${status === 'approved' ? 'approved' : 'declined'} your swap request.`);
                    notify(swap.partner_id, `HOD has ${status === 'approved' ? 'approved' : 'declined'} your swap request.`);
                    
                    if (status === 'approved') {
                        // Perform the actual batch swap
                        db.get(`SELECT batch FROM users WHERE id = ?`, [swap.initiator_id], (err, iUser) => {
                            db.get(`SELECT batch FROM users WHERE id = ?`, [swap.partner_id], (err, pUser) => {
                                db.run(`UPDATE users SET batch = ? WHERE id = ?`, [pUser.batch, swap.initiator_id]);
                                db.run(`UPDATE users SET batch = ? WHERE id = ?`, [iUser.batch, swap.partner_id]);
                            });
                        });
                    }
                }
            });

            res.json({ message: `Request ${status}.` });
        }
    );
});

// GET /api/swaps/stats
router.get('/stats', authenticateToken, requireAdminOrHOD, (req, res) => {
    db.get(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending_admin' THEN 1 ELSE 0 END) as pending_admin,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status IN ('rejected_partner', 'rejected_admin') THEN 1 ELSE 0 END) as rejected
      FROM swap_requests
    `, [], (err, stats) => {
      if (err) return res.status(500).json({ message: 'Server error.' });
      
      db.get(`SELECT COUNT(*) as students FROM users WHERE role = 'student'`, [], (err, sStats) => {
          res.json({...stats, total_students: sStats ? sStats.students : 0});
      });
    });
});

// GET /api/swaps/students - All students for admin/HOD directory
router.get('/students', authenticateToken, requireAdminOrHOD, (req, res) => {
    db.all(`SELECT id, name, reg_no, email, batch, cgpa, year FROM users WHERE role = 'student' ORDER BY name`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error.' });
        res.json(rows);
    });
});

// GET /api/swaps/audit-log - Complete audit log for HOD/Admin (all decisions)
router.get('/audit-log', authenticateToken, requireAdminOrHOD, (req, res) => {
    const query = `
      SELECT sr.id, sr.status, sr.reason, sr.admin_comment, sr.created_at, sr.updated_at,
             i.name as initiator_name, i.batch as initiator_batch, i.reg_no as initiator_reg, 
             i.slot as initiator_slot, i.cgpa as initiator_cgpa,
             p.name as partner_name, p.batch as partner_batch, p.reg_no as partner_reg, 
             p.slot as partner_slot, p.cgpa as partner_cgpa
      FROM swap_requests sr
      JOIN users i ON sr.initiator_id = i.id
      JOIN users p ON sr.partner_id = p.id
      WHERE sr.status IN ('approved', 'rejected_admin')
      ORDER BY sr.updated_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Audit log error:', err.message);
            return res.status(500).json({ message: 'Server error.', error: err.message });
        }
        res.json(rows || []);
    });
});

// GET /api/swaps/notifications (Bonus tool)
router.get('/notifications', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
        res.json(rows || []);
        db.run(`UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`, [req.user.id]); // mark as read
    });
});

module.exports = router;
