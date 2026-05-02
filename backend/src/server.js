require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { testConnection } = require('./config/db');

async function startServer() {
  try {
    await testConnection();
    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`DocSpace backend listening on port ${config.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MySQL:', error.message);
    process.exit(1);
  }
}

startServer();
