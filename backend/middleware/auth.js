const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT sent as a Bearer token and attaches req.user
async function protect(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated — please log in.' });

    const secret = process.env.JWT_SECRET || 'ecopocket_secret_key_jwt_authentication_2026_super_secure';
    const decoded = jwt.verify(token, secret);

    // If MongoDB is connected, find user in DB
    if (require('mongoose').connection.readyState === 1) {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });
      req.user = user;
    } else {
      // Look up in devStore
      const devStore = require('../utils/devStore');
      const user = devStore.findUserById(decoded.id);
      if (user) {
        req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      } else {
        req.user = { id: decoded.id, role: decoded.role || 'user' };
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

// Restricts a route to specific roles, e.g. restrictTo('admin')
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = { protect, restrictTo };
