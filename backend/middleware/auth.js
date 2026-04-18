const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

const requireAdminOrHOD = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied. Admin or HOD only.' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, requireAdminOrHOD };
