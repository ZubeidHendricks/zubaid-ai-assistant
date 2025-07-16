@echo off
echo 🤖 ZUBAID AI Workflow System - Google AI Powered
echo.
echo ✅ Your Google Credentials:
echo    API Key: AIza...OeY (configured)
echo    Project: zubaid-463014 (configured)
echo    Client Secret: GOCSPX-...5te (configured)
echo.
echo 🔗 Integration Mode: Google AI
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies including Google AI...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Run setup script
echo ⚙️ Running setup...
npm run setup

REM Set environment variables for this session
set PORT=3001
set NODE_ENV=development
set ADK_MODE=google_ai

echo.
echo ✅ Setup complete with Google AI integration!
echo.
echo 🌐 Starting server on http://localhost:3001
echo.
echo 🤖 Google AI Powered Features:
echo - Real AI agent responses using Google Gemini
echo - Your actual Google Cloud credentials
echo - Professional AI-generated insights
echo.
echo 📊 Available interfaces:
echo - Main: http://localhost:3001
echo - Dashboard: http://localhost:3001/dashboard  
echo - Human Review: http://localhost:3001/human-review
echo - CoE Review: http://localhost:3001/coe-review
echo - AI Agents: http://localhost:3001/agents
echo - Status: http://localhost:3001/api/status
echo.
echo 🔗 Integration Mode: GOOGLE AI (Real AI responses)
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start

pause