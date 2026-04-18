const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, reg_no, batch, slot, section, cgpa, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (name, email, password, role, reg_no, batch, slot, section, cgpa, year) VALUES (?, ?, ?, 'student', ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, reg_no || null, batch || null, slot || null, section || null, cgpa || null, year || null],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Email or Registration Number already registered.' });
          }
          return res.status(500).json({ message: 'Registration failed.', error: err.message });
        }
        res.status(201).json({ message: 'Registration successful. Please log in.' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body; // Can also be reg_no for students, but let's keep email or reg_no

  if (!email || !password) {
    return res.status(400).json({ message: 'Email/RegNo and password are required.' });
  }

  db.get(`SELECT * FROM users WHERE email = ? OR reg_no = ?`, [email, email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        reg_no: user.reg_no,
        batch: user.batch,
        slot: user.slot,
        section: user.section,
        cgpa: user.cgpa,
        year: user.year
      },
    });
  });
});

// GET /api/auth/me
const { authenticateToken } = require('../middleware/auth');
router.get('/me', authenticateToken, (req, res) => {
  db.get(`SELECT id, name, email, role, reg_no, batch, slot, section, cgpa, year, created_at FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  });
});

module.exports = router;
