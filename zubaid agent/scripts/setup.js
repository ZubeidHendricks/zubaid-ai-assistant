// Setup script for initial configuration
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ZUBAID AI Workflow System...');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create basic .env file
    const basicEnv = `PORT=3001
NODE_ENV=development
GOOGLE_ADK_URL=http://localhost:8000
GOOGLE_ADK_API_KEY=your-google-adk-api-key
LOG_LEVEL=info
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Created basic .env file');
  }
} else {
  console.log('ℹ️  .env file already exists');
}

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Created logs directory');
}

// Check if all required directories exist
const requiredDirs = ['config', 'services', 'routes', 'public'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} directory exists`);
  } else {
    console.log(`❌ ${dir} directory missing`);
  }
});

console.log('\n🎯 Setup Instructions:');
console.log('1. Update .env file with your Google ADK configuration');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('4. Open: http://localhost:3001');
console.log('\n📖 For Google ADK integration:');
console.log('- Update GOOGLE_ADK_URL in .env');
console.log('- Replace simulation in services/googleADKService.js with real API calls');
console.log('\n✨ Setup complete!');
