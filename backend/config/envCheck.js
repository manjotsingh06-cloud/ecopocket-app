// Fail-fast environment validation — run at startup, before the server binds.
// Keeps misconfigured deployments from silently running in a degraded state.
function validateEnv() {
  const missing = [];

  const secret = process.env.JWT_SECRET;
  if (!secret) missing.push('JWT_SECRET');
  else if (secret.length < 16) {
    console.warn('⚠️  JWT_SECRET is shorter than 16 characters — use a long random string for production.');
  }

  if (!process.env.CLIENT_URL) missing.push('CLIENT_URL');

  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required when NODE_ENV=production. Add it to backend/.env and restart the server.');
  }
  if (isProduction && secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 random characters in production. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64\'))"'
    );
  }
  if (!isProduction && !process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set — running in development with the zero-config file store.');
  }

  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'Copy backend/.env.example to backend/.env and fill them in.'
    );
  }
}

module.exports = validateEnv;