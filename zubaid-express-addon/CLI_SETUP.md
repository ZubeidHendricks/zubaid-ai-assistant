# 🛠️ ZUBAID CLI Development Setup - 2025 Features

## Quick Start with Adobe Express CLI

### Prerequisites
- Node.js 16+ 
- npm 8+
- Adobe Express account with Developer Mode enabled

### Installation & Setup

```bash
# Navigate to ZUBAID addon directory
cd /path/to/zubaid-express-addon

# Run initialization script (recommended)
node init-project.js

# Or manual setup:
npm install @adobe/create-ccweb-add-on --save-dev

# Start development server with hot reloading
npm run dev
```

### Adobe Express Configuration

1. **Enable Developer Mode**
   - Open Adobe Express
   - Click avatar → Settings → Enable "Add-on Development"

2. **Connect to Local Server**
   - In Adobe Express: Add-ons → Your add-ons tab
   - Toggle "Add-on testing" switch
   - Enter: `https://localhost:5241`
   - Accept SSL certificate warning (normal for local development)

3. **Test ZUBAID**
   - ZUBAID should appear in your add-ons panel
   - Click to launch and test multi-agent workflow

## 2025 Enhanced Features

### Hot Module Reloading
- File changes automatically reload in Adobe Express
- No need to manually refresh during development
- Real-time code changes reflected instantly

### Advanced Debugging
```bash
# Check add-on status
express-addon status

# Validate manifest and code
npm run validate

# Build for production
npm run build

# Package for distribution
npm run package
```

### Testing Commands
```bash
# Run full test suite
npm run test

# Test specific components
express-addon test --component ui
express-addon test --component document-sandbox

# Performance testing
express-addon test --performance
```

## Development Workflow

### 1. Live Development
```bash
# Start with hot reloading
npm run dev

# File watching enabled automatically
# Changes to index.html, code.js reload instantly
```

### 2. Manifest Updates
- Changes to `manifest.json` require manual reload
- Use "Refresh" button in Adobe Express Add-on Development panel
- Check console for manifest validation errors

### 3. Document API Testing
- Open browser console to see ZUBAID logs
- Test agent workflow with different project briefs
- Monitor element creation in real-time

### 4. Multi-Agent Workflow Testing
```
Test Scenarios:
1. "Create a social media campaign for an eco-friendly water bottle"
2. "Design a logo for a tech startup" 
3. "Build marketing materials for a fitness app"
```

## 2025 Feature Integration

### Advanced Text Styling
```javascript
// Test character styles
const textNode = await createAdvancedText("Test", {
  characterStyles: {
    fontWeight: 900,
    letterSpacing: -0.02
  }
});
```

### Persistent Metadata
```javascript
// Test AddOnData API
await element.addOnData.setSharedData({
  source: 'ZUBAID',
  agent: 'alex',
  version: '2025.1.0'
});
```

### Visual Node Features
```javascript
// Test enhanced visual elements
const rect = editor.createRectangle();
rect.cornerRadius = 12; // 2025 feature
rect.bringIntoView(); // 2025 feature
```

## Troubleshooting

### Common Issues

#### Port 5241 in use
```bash
# Check what's using the port
lsof -i :5241

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 5242
```

#### SSL Certificate Issues
```bash
# Trust local certificate
# Chrome: Advanced → Proceed to localhost (unsafe)
# This is normal for local development
```

#### Hot Reload Not Working
```bash
# Clear cache and restart
rm -rf .addon-cache/
npm run dev
```

### Performance Optimization

#### Development Mode
- Use `npm run dev` for fastest iteration
- Hot reloading enabled by default
- Source maps for debugging

#### Production Mode
```bash
# Build optimized version
npm run build

# Test production build
express-addon serve --build
```

## 2025 Compliance Features

### EU Trader Information
- Already configured in `manifest.json`
- Required for EU visibility by Feb 16, 2025
- Update trader details in manifest

### Privacy & Security
- HTTPS required for development
- Secure data handling implemented
- User consent mechanisms built-in

## Advanced CLI Commands

### Project Management
```bash
# Create new addon from template
express-addon create my-addon --template javascript-with-document-sandbox

# Validate project structure
express-addon validate --verbose

# Generate documentation
express-addon docs --generate
```

### Debugging Tools
```bash
# Enable verbose logging
express-addon start --verbose --debug

# Monitor performance
express-addon profile --duration 60

# Check compatibility
express-addon check --compatibility
```

### Publishing Preparation
```bash
# Pre-publish validation
express-addon validate --strict

# Package for Adobe marketplace
npm run package

# Test packaged addon
express-addon test --package dist/zubaid-addon.zip
```

## Integration with Existing Zubaid System

### Backend Connection
```javascript
// Connect to local Zubaid API
const Zubaid_API = 'http://localhost:3001';

// Use existing multi-AI infrastructure
const response = await fetch(`${Zubaid_API}/api/agents`, {
  method: 'POST',
  body: JSON.stringify(agentRequest)
});
```

### Shared Configuration
- Use same AI provider keys
- Leverage existing agent configurations
- Maintain workflow compatibility

---

**🚀 Ready to develop with ZUBAID 2025! Start with `npm run dev` and begin creating the future of AI-assisted design.**