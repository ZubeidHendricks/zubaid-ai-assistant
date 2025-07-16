#!/usr/bin/env node

/**
 * ZUBAID Adobe Express Add-on - Project Initialization Script
 * This script sets up the proper development environment using Adobe's official CLI
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 Initializing ZUBAID Adobe Express Add-on Development Environment...');
console.log('');

// Check Node.js version
const nodeVersion = process.version;
const major = parseInt(nodeVersion.split('.')[0].substring(1));

if (major < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  console.error('   Please upgrade Node.js from https://nodejs.org/');
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  const npmMajor = parseInt(npmVersion.split('.')[0]);
  
  if (npmMajor < 8) {
    console.error('❌ npm version 8 or higher is required');
    console.error(`   Current version: ${npmVersion}`);
    console.error('   Please upgrade npm: npm install -g npm@latest');
    process.exit(1);
  }
  
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm is not installed or not in PATH');
  process.exit(1);
}

console.log('');

// Check if we're in the right directory
const currentDir = process.cwd();
const expectedFiles = ['manifest.json', 'index.html', 'code.js'];
const missingFiles = expectedFiles.filter(file => !fs.existsSync(path.join(currentDir, file)));

if (missingFiles.length > 0) {
  console.error('❌ Missing required ZUBAID files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  console.error('');
  console.error('Please run this script from the zubaid-express-addon directory');
  process.exit(1);
}

console.log('✅ ZUBAID add-on files found');

// Install dependencies
console.log('');
console.log('📦 Installing Adobe Express Add-on dependencies...');

try {
  // Install the Adobe CLI
  execSync('npm install @adobe/create-ccweb-add-on --save-dev', { 
    stdio: 'inherit',
    cwd: currentDir 
  });
  
  console.log('✅ Adobe Express CLI installed');
} catch (error) {
  console.error('❌ Failed to install Adobe Express CLI');
  console.error('   Please try running: npm install @adobe/create-ccweb-add-on --save-dev');
  process.exit(1);
}

// Verify manifest.json is valid
console.log('');
console.log('🔍 Validating ZUBAID manifest...');

try {
  const manifestPath = path.join(currentDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Check required fields
  const requiredFields = ['testId', 'name', 'version', 'manifestVersion'];
  const missing = requiredFields.filter(field => !manifest[field]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required manifest fields:');
    missing.forEach(field => console.error(`   - ${field}`));
    process.exit(1);
  }
  
  // Verify ZUBAID branding
  if (!manifest.name.includes('ZUBAID')) {
    console.error('❌ Manifest name should include "ZUBAID"');
    process.exit(1);
  }
  
  console.log(`✅ Manifest valid: ${manifest.name} v${manifest.version}`);
} catch (error) {
  console.error('❌ Invalid manifest.json:', error.message);
  process.exit(1);
}

// Create development certificate info
console.log('');
console.log('🔐 Setting up HTTPS development environment...');
console.log('');
console.log('📋 Next Steps:');
console.log('');
console.log('1. Enable Developer Mode in Adobe Express:');
console.log('   - Go to https://express.adobe.com');
console.log('   - Click avatar → Settings → Enable "Add-on Development"');
console.log('');
console.log('2. Start ZUBAID development server:');
console.log('   npm run dev');
console.log('');
console.log('3. Test ZUBAID in Adobe Express:');
console.log('   - Create new project in Adobe Express');
console.log('   - Add-ons → Your add-ons → Toggle "Add-on testing"');
console.log('   - Enter URL: https://localhost:5241');
console.log('   - Accept SSL certificate warning (normal for local dev)');
console.log('');
console.log('4. Test with demo scenario:');
console.log('   "Create a social media campaign for an eco-friendly water bottle targeting millennials"');
console.log('');
console.log('🎯 ZUBAID Features to Test:');
console.log('✅ Multi-agent workflow (6 AI agents collaborating)');
console.log('✅ Real-time progress visualization');
console.log('✅ Adobe Express element creation');
console.log('✅ Professional design output');
console.log('✅ 2025 enhanced features (metadata, styling)');
console.log('');
console.log('🚀 ZUBAID development environment ready!');
console.log('');
console.log('For detailed testing instructions, see:');
console.log('- TESTING_GUIDE.md');
console.log('- DEVELOPMENT_SETUP.md');
console.log('- DEMO_SCRIPT.md');