// Startup script for development
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set development defaults
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

if (!process.env.PORT) {
  process.env.PORT = '3001';
}

if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL = 'info';
}

// Start the application
require('./app.js');