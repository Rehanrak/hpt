const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, 'batch_swap.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users table for VIT CSE
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'admin')),
        reg_no TEXT UNIQUE,
        batch TEXT,
        cgpa REAL,
        year INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Swap requests table for 2-way handshake
    db.run(`
      CREATE TABLE IF NOT EXISTS swap_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        initiator_id INTEGER NOT NULL,
        partner_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending_partner' 
          CHECK(status IN ('pending_partner', 'rejected_partner', 'pending_admin', 'approved', 'rejected_admin')),
        reason TEXT,
        admin_comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (initiator_id) REFERENCES users(id),
        FOREIGN KEY (partner_id) REFERENCES users(id)
      )
    `);

    // Notifications
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Seed data
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
      if (row.count === 0) {
        console.log('Seeding initial data...');
        const hashedAdmin = await bcrypt.hash('admin123', 10);
        db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
          ['HOD Admin', 'admin@vit.ac.in', hashedAdmin, 'admin']);

        const hashedStudent = await bcrypt.hash('password123', 10);
        
        // Seed some students
        const students = [
          ['John Doe', 'john@vit.ac.in', '21BCE001', 'CS-A', 8.5, 3],
          ['Jane Smith', 'jane@vit.ac.in', '21BCE002', 'CS-B', 8.2, 3],
          ['Alice Brown', 'alice@vit.ac.in', '21BCE003', 'CS-B', 9.0, 3],
          ['Bob White', 'bob@vit.ac.in', '21BCE004', 'CS-A', 7.8, 3],
          ['Charlie Green', 'charlie@vit.ac.in', '21BCE005', 'CS-C', 8.6, 3]
        ];

        const stmt = db.prepare(`INSERT INTO users (name, email, password, role, reg_no, batch, cgpa, year) VALUES (?, ?, ?, 'student', ?, ?, ?, ?)`);
        students.forEach(s => {
          stmt.run(s[0], s[1], hashedStudent, s[2], s[3], s[4], s[5]);
        });
        stmt.finalize();
        console.log('Seeded admin and 5 sample students.');
      }
    });
  });
}

module.exports = db;
