require('dotenv').config();
require('./config/envCheck'); // fail fast on missing/invalid environment configuration

const app = require('./app');
const { connectDB } = require('./config/db');

async function start() {
  // Resolve the storage backend (MongoDB or the dev file store) BEFORE accepting
  // any request. Otherwise early registrations/logins race the connection and end
  // up in the file store while MongoDB is still connecting — making those users
  // "vanish" from the database. See config/db.js.
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🌿 EcoPocket API listening on port ${PORT}`));
}

start().catch((err) => {
  console.error('💥 Failed to start server:', err.message);
  process.exit(1);
});

module.exports = app;