# 🧪 ZUBAID Code Playground Setup - Complete Guide

## 🎯 What is Adobe Express Code Playground?

Adobe Express Code Playground is a lightweight code editor designed for fast and effortless add-on prototyping. It allows you to experiment and iterate on ideas directly within Adobe Express without any setup, making it perfect for testing ZUBAID's multi-agent workflow.

## 🚀 Quick Setup (2 minutes)

### Step 1: Enable Developer Mode

1. **Access Adobe Express**
   - Navigate to [Adobe Express](https://express.adobe.com)
   - Sign in to your account

2. **Enable Development Features**
   - Click your avatar (top right corner)
   - Click the gear icon to open "Settings"
   - Enable "Add-on Development" if not already enabled
   - Accept Developer Terms of Use if prompted

### Step 2: Open Code Playground

1. **Create or Open Document**
   - Create a new document or open an existing one
   - Any document type will work for testing

2. **Access Code Playground**
   - Click "Add-ons" button in the left sidebar
   - Select "Your add-ons" tab
   - Toggle on "Code Playground" at the bottom of the panel

### Step 3: Import ZUBAID

1. **Select Add-on Mode**
   - Code Playground opens with two modes:
     - **Script Mode**: For experimenting with Document APIs
     - **Add-on Mode**: For full add-on testing (select this)

2. **Copy ZUBAID Files**
   
   **Manifest Tab** - Copy this exact content:
   ```json
   {
     "testId": "zubaid-ai-assistant-2025",
     "name": "ZUBAID - Your AI Assistant",
     "version": "2025.1.0",
     "manifestVersion": 2,
     "description": "Multi-agent AI creative team for Adobe Express",
     "author": "Zubeid Hendricks",
     "requiredPermissions": {
       "webview": {
         "allow": "yes",
         "domains": ["https://localhost:3001"]
       },
       "documentSandbox": {
         "allow": "yes",
         "permissions": ["read", "write"]
       }
     },
     "uiEntry": {
       "type": "panel",
       "src": "index.html"
     },
     "documentSandbox": {
       "type": "script",
       "src": "code.js"
     },
     "icons": [
       {
         "width": 24,
         "height": 24,
         "path": "icons/icon-24.png",
         "theme": ["lightest", "light", "dark", "darkest"]
       }
     ]
   }
   ```

   **HTML Tab** - Copy the entire contents of `zubaid-express-addon/index.html`
   
   **CSS Tab** - Leave empty (styles are included in HTML)
   
   **iFrameJS Tab** - Copy the entire contents of `zubaid-express-addon/code.js`

3. **Run ZUBAID**
   - Click the "Run" button
   - Or use keyboard shortcut: `Cmd(Ctrl) + Shift + Enter`
   - ZUBAID should appear in the right panel

## 🤖 Testing ZUBAID's Multi-Agent Workflow

### Basic Test (1 minute)

1. **Enter Project Brief**
   - In the ZUBAID panel, enter: "Create a social media campaign for an eco-friendly water bottle targeting millennials"
   - Select project type: "Social Media Campaign"
   - Choose audience: "Millennials"

2. **Start Workflow**
   - Click "Let ZUBAID's Team Get Started"
   - Watch the 6 AI agents collaborate in real-time:
     - 🎨 Alex (Creative Director) - Sets visual strategy
     - 📝 Blake (Content Strategist) - Creates compelling copy
     - 🎯 Zara (Visual Designer) - Designs layouts
     - 🛡️ Nova (Brand Guardian) - Ensures quality
     - 📱 Morgan (Platform Optimizer) - Optimizes for platforms
     - ✅ Riley (Quality Assurance) - Final review

3. **View Results**
   - Elements will be created directly in your Adobe Express document
   - Background, text, shapes, and design elements appear
   - Check browser console (F12) for detailed logs

### Advanced Test Scenarios

#### Test 1: Tech Startup Logo
```
Project Brief: "Design a logo for a tech startup focused on AI automation"
Project Type: Brand Identity
Target Audience: Business professionals
Expected: Modern, tech-forward design with professional colors
```

#### Test 2: Fitness App Marketing
```
Project Brief: "Create product marketing materials for a new fitness app"
Project Type: Marketing Materials
Target Audience: Health-conscious users
Expected: Energetic, vibrant design with dynamic elements
```

#### Test 3: Restaurant Menu Design
```
Project Brief: "Design a menu for an upscale Italian restaurant"
Project Type: Menu Design
Target Audience: Fine dining customers
Expected: Elegant typography, sophisticated layout, premium feel
```

## 🔍 Debugging & Troubleshooting

### Common Issues

#### ZUBAID Doesn't Load
- **Check Console**: Press F12 → Console tab for error messages
- **Verify Code**: Ensure all tabs have correct content
- **Reload**: Click "Run" button again
- **Clear Cache**: Refresh Adobe Express page

#### Agents Don't Start
- **Check Input**: Ensure project brief is filled in
- **Button State**: "Let ZUBAID's Team Get Started" should be clickable
- **Console Logs**: Look for "ZUBAID controller initialized" message

#### No Elements Created
- **Document Access**: Check for "Document context acquired" in console
- **API Errors**: Look for Document API error messages
- **Fallback Mode**: Should create basic elements even if advanced features fail

### Debug Console Commands

Open browser console (F12) and look for these logs:
```
🤖 ZUBAID Express Controller initialized
✅ Document context acquired
✅ ZUBAID listener setup complete
🎨 Alex (Creative Director): Applying visual strategy
📝 Blake (Content Strategist): Adding messaging
🎯 Zara (Visual Designer): Creating visual elements
🛡️ Nova (Brand Guardian): Ensuring brand consistency
📱 Morgan (Platform Optimizer): Optimizing for platforms
✅ Riley (Quality Assurance): Final quality check
🎉 ZUBAID design workflow complete!
```

## 📊 Performance Expectations

### Timing Benchmarks
- **Code Playground Load**: < 5 seconds
- **ZUBAID Panel Load**: < 3 seconds
- **Agent Workflow**: 10-15 seconds total
- **Element Creation**: 5-8 elements per workflow

### Success Indicators
- ✅ All 6 agents show progress indicators
- ✅ Real-time decisions appear in UI
- ✅ Adobe Express elements are created
- ✅ Professional cohesive design output
- ✅ Console shows no critical errors

## 🎬 Recording Demo Videos

### For Pitch Videos
1. **Full Screen Recording**: Capture entire Adobe Express interface
2. **Clear Audio**: Narrate the multi-agent process
3. **Show Workflow**: Focus on agent collaboration visualization
4. **Highlight Results**: Pan around final design elements

### Key Moments to Capture
- Initial ZUBAID interface and project brief entry
- Live agent collaboration with progress indicators
- Real-time decision updates in the panel
- Adobe Express elements appearing in document
- Final completed professional design

## 🏆 Hackathon Demo Points

### Technical Innovation (30 points)
- ✅ First multi-agent AI system in creative tools
- ✅ Real-time workflow visualization
- ✅ Official Adobe Express Document API integration
- ✅ Professional design automation

### User Experience (25 points)
- ✅ Intuitive natural language input
- ✅ Live progress tracking with agent visualization
- ✅ Professional design output
- ✅ Personal AI assistant branding

### Market Impact (25 points)
- ✅ Democratizes professional design
- ✅ Massive time savings (hours to minutes)
- ✅ Seamless Adobe Express integration
- ✅ Scalable for millions of users

### Innovation & Creativity (20 points)
- ✅ Unique collaborative AI approach
- ✅ Revolutionary multi-agent workflow
- ✅ Personal AI assistant concept
- ✅ Future-ready architecture

## 🚀 Moving to Production

### Export to Local Development
1. **Follow Quickstart Guide**: Set up local development environment
2. **Copy Code**: Transfer Code Playground code to local files
3. **Install Dependencies**: Use npm install for full development
4. **Test Locally**: Use Adobe Express CLI for local testing

### Production Deployment
1. **Build**: Create production-ready build
2. **Package**: Package for Adobe marketplace
3. **Submit**: Submit to Adobe Express add-on store
4. **Monitor**: Track usage and performance

---

**🎯 Ready to test ZUBAID? Start with the eco-friendly water bottle scenario for the best demo experience!**

The Code Playground provides the fastest way to experience ZUBAID's revolutionary multi-agent AI workflow directly in Adobe Express.