const { validationResult } = require('express-validator');

// Runs after an array of express-validator checks; returns 400 with field errors if any failed
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
}

module.exports = validate;
