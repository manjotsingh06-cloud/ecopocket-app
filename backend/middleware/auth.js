const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isMongo } = require('../config/db');

// Verifies the JWT sent as a Bearer token and attaches req.user
async function protect(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated — please log in.' });

    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // Always resolve the user AND their role from a trusted store (MongoDB or the
    // file store). Never trust the token's own claims for authorization — a JWT's
    // `role` is client-asserted and forgeable if the secret is weak or leaked.
    if (isMongo()) {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });
      req.user = user;
    } else {
      const devStore = require('../utils/devStore');
      const user = devStore.findUserById(decoded.id);
      if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });
      req.user = { id: user.id, name: user.name, email: user.email, role: user.role, mustChangePassword: user.mustChangePassword || false };
    }

    // Force a password change before any other API use (except the change-password call itself).
    if (
      req.user &&
      req.user.mustChangePassword &&
      !req.originalUrl.includes('/auth/change-password')
    ) {
      return res.status(403).json({
        success: false,
        code: 'PASSWORD_CHANGE_REQUIRED',
        message: 'You must change your password before continuing.',
      });
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

// Optional auth - if a valid token is provided, attaches req.user without failing unauthenticated requests
async function optionalAuth(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
    if (!token) return next();

    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    if (isMongo()) {
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    } else {
      const devStore = require('../utils/devStore');
      const user = devStore.findUserById(decoded.id);
      if (user) {
        req.user = { id: user.id, name: user.name, email: user.email, role: user.role, mustChangePassword: user.mustChangePassword || false };
      }
      // No user record found ⇒ treat as unauthenticated (no req.user). Never
      // fabricate an identity/role from the token itself.
    }
  } catch (err) {
    // Ignore invalid token on optional auth
  }
  next();
}

module.exports = { protect, restrictTo, optionalAuth };

