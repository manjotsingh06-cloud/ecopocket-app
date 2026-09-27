const crypto = require('crypto');

// This exact value was committed to the public GitHub repo, so it must never sign
// tokens again. If the host still has it configured, treat it as "not set".
const COMPROMISED = 'ecopocket_secret_key_jwt_authentication_2026_super_secure';

/**
 * Returns the key used to sign + verify session tokens.
 *
 * Never falls back to the publicly-known value above, and never takes the whole
 * API down just because JWT_SECRET hasn't been pasted into the hosting dashboard
 * yet. In that case a private key is derived from MONGODB_URI — also a secret,
 * never committed, and one that already grants full database access to whoever
 * holds it, so deriving from it is not a downgrade.
 */
function resolveJwtSecret() {
  const configured = process.env.JWT_SECRET;
  if (configured && configured !== COMPROMISED) return configured;

  const seed = process.env.MONGODB_URI;
  if (!seed) {
    throw new Error(
      'No token signing key available — set JWT_SECRET (and MONGODB_URI) in the environment.'
    );
  }

  console.warn(
    configured
      ? '⚠️ JWT_SECRET is still the value committed to the public repo. Using a private key derived from MONGODB_URI instead. Set a fresh JWT_SECRET in your hosting dashboard to finish rotating it.'
      : '⚠️ JWT_SECRET is not set. Using a private key derived from MONGODB_URI. Add JWT_SECRET in your hosting dashboard to finish rotating it.'
  );

  return crypto.createHash('sha256').update(`ecopocket.jwt.v2:${seed}`).digest('hex');
}

module.exports = resolveJwtSecret;
