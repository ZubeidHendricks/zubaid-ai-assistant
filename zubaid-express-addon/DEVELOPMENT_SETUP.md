# 🛠️ ZUBAID Adobe Express Add-on - Official Development Setup

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (version 8 or higher)
- **Adobe Express account** with Developer Mode enabled

## Quick Setup Guide

### 1. Enable Developer Mode in Adobe Express

1. Open [Adobe Express](https://express.adobe.com)
2. Click your avatar (top right) → Settings (gear icon)
3. Enable "Add-on Development" if not already enabled
4. Read and accept the Developer Terms of Use

### 2. Install Dependencies

```bash
# Navigate to ZUBAID add-on directory
cd /path/to/zubaid-express-addon

# Install dependencies (uses official Adobe CLI)
npm install
```

### 3. Start Local Development Server

```bash
# Start development server with hot reloading
npm run dev

# Server will run on https://localhost:5241
```

### 4. Test ZUBAID in Adobe Express

1. **Open Adobe Express** and create a new project
2. **Click Add-ons** icon in left sidebar
3. **Go to "Your add-ons" tab**
4. **Toggle "Add-on testing" switch**
5. **Enter URL**: `https://localhost:5241`
6. **Click "Test add-on"** - ZUBAID should appear in the panel

## Development Workflow

### Hot Module Reloading

The development server includes automatic hot reloading:
- Edit `index.html`, `code.js`, or `manifest.json`
- Changes are automatically reflected in Adobe Express
- No need to manually refresh

### File Structure

```
zubaid-express-addon/
├── manifest.json       # Add-on configuration & permissions
├── index.html          # Main UI (6-agent workflow interface)
├── code.js            # Document SDK integration
├── package.json       # Project configuration
├── icons/             # Add-on icons
└── README.md          # Documentation
```

### Testing Scenarios

Use these project briefs to test ZUBAID's multi-agent workflow:

1. **Eco-Friendly Campaign** (Recommended for demos)
   - Brief: "Create a social media campaign for an eco-friendly water bottle targeting millennials"
   - Expected: 6 agents collaborate to create professional design

2. **Tech Startup Logo**
   - Brief: "Design a logo for a tech startup focused on AI automation"
   - Expected: Modern, professional logo with tech aesthetics

3. **Fitness App Marketing**
   - Brief: "Create product marketing materials for a new fitness app"
   - Expected: Energetic, vibrant design with clear messaging

## Adobe Express Integration Features

### 2025 Enhanced Features

ZUBAID leverages the latest Adobe Express capabilities:

- **Document Sandbox**: Full document manipulation
- **Advanced Text Styling**: Character and paragraph styles
- **Persistent Metadata**: Track ZUBAID-created elements
- **Visual Nodes**: Enhanced element creation
- **Multi-format Export**: Optimized for different platforms

### Real-time Multi-Agent Workflow

Watch ZUBAID's 6 AI agents collaborate:

1. **Alex (Creative Director) 🎨** - Sets visual strategy
2. **Blake (Content Strategist) 📝** - Creates compelling copy
3. **Zara (Visual Designer) 🎯** - Designs layouts
4. **Nova (Brand Guardian) 🛡️** - Ensures quality
5. **Morgan (Platform Optimizer) 📱** - Optimizes for platforms
6. **Riley (Quality Assurance) ✅** - Final review

## Troubleshooting

### Common Issues

#### SSL Certificate Warning
```
Chrome: Click "Advanced" → "Proceed to localhost (unsafe)"
This is normal for local development
```

#### Port 5241 Already in Use
```bash
# Check what's using the port
lsof -i :5241

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 5242
```

#### Add-on Not Loading
- Verify Developer Mode is enabled
- Check browser console for errors
- Ensure HTTPS is working (not HTTP)
- Try refreshing Adobe Express

#### Hot Reload Not Working
- Save files explicitly (Ctrl+S)
- Check terminal for build errors
- Restart development server if needed

### Debug Mode

Enable verbose logging:
```bash
# Start with debug output
npm run dev -- --verbose

# Check Adobe Express browser console
# Look for ZUBAID initialization messages
```

## Advanced Development

### Custom Backend Integration

ZUBAID can connect to the local multi-AI backend:

```javascript
// Connect to ZUBAID agent system
const ZUBAID_API = 'http://localhost:3001';

// Use existing multi-AI infrastructure
const response = await fetch(`${ZUBAID_API}/api/agents`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectBrief: userInput,
    targetAudience: selectedAudience,
    projectType: selectedType
  })
});
```

### Multi-AI Provider Support

ZUBAID supports multiple AI providers:
- **OpenAI GPT-4**: Creative tasks
- **Anthropic Claude**: Strategic reasoning
- **Google Gemini**: General intelligence
- **Fallback Systems**: Graceful degradation

## Production Deployment

### Building for Distribution

```bash
# Create production build
npm run build

# Package for Adobe marketplace
npm run package
```

### Submission Checklist

- [ ] All "Northstar" references removed
- [ ] ZUBAID branding consistent
- [ ] Multi-agent workflow functional
- [ ] Adobe Express integration working
- [ ] 2025 features implemented
- [ ] EU compliance info added
- [ ] Performance optimized
- [ ] Error handling robust

## Support

For issues or questions:
- Check Adobe Express Add-on Documentation
- Test in Adobe Express Code Playground first
- Verify all dependencies are installed
- Ensure Developer Mode is enabled

---

**🚀 Ready to develop ZUBAID! Start with `npm run dev` and begin creating the future of AI-assisted design.**