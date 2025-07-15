// Main server with Google AI integration
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import services based on ADK mode and available API keys
const adkMode = process.env.ADK_MODE || 'simulation';
let adkService;

// Check for enhanced AI capabilities
const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here';
const hasAnthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key-here';
const hasGoogle = process.env.GOOGLE_API_KEY;

if (hasGoogle && (hasOpenAI || hasAnthropic)) {
  // Use enhanced multi-AI service
  const { EnhancedAIService } = require('./services/enhancedAIService');
  const enhancedService = new EnhancedAIService();
  adkService = {
    executeGoogleADKWorkflow: enhancedService.executeEnhancedWorkflow.bind(enhancedService),
    executeGoogleADKAdjustments: enhancedService.executeEnhancedWorkflow.bind(enhancedService)
  };
  console.log('🚀 Using Enhanced Multi-AI powered service');
  console.log(`   OpenAI: ${hasOpenAI ? '✅' : '❌'} | Anthropic: ${hasAnthropic ? '✅' : '❌'} | Google: ${hasGoogle ? '✅' : '❌'}`);
} else if (adkMode === 'google_ai' && hasGoogle) {
  adkService = require('./services/googleAIService');
  console.log('🔗 Using Google AI powered ADK service');
} else {
  adkService = require('./services/googleADKService');
  console.log(`🔗 Using ADK service in ${adkMode} mode`);
}

const { generateAndSendQuote, calculateIterationPenalty } = require('./services/billingService');
const { WORKFLOW_STATES, GOOGLE_ADK_AGENTS } = require('./config/constants');
const projectRoutes = require('./routes/projectRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (in production, use database)
const projects = new Map();
const agentWorkStorage = new Map();
const humanReviews = new Map();
const coeApprovals = new Map();

// Make services available to other modules
app.locals = {
  io,
  projects,
  agentWork: agentWorkStorage,
  humanReviews,
  coeApprovals,
  executeGoogleADKWorkflow: adkService.executeGoogleADKWorkflow,
  executeGoogleADKAdjustments: adkService.executeGoogleADKAdjustments,
  generateAndSendQuote
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-win11.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard-win11.html'));
});

// Windows 11 style routes
app.get('/index-win11', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-win11.html'));
});

app.get('/dashboard-win11', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard-win11.html'));
});

// Removed old file references - all routes now use Win11 versions

app.get('/human-review', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'human-review-win11.html'));
});

app.get('/human-review-win11', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'human-review-win11.html'));
});

// Removed - file no longer exists

app.get('/coe-review', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'coe-review-win11.html'));
});

app.get('/coe-review-win11', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'coe-review-win11.html'));
});

// Removed - file no longer exists

app.get('/agents', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agents-win11.html'));
});

app.get('/agents-win11', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agents-win11.html'));
});

// Enhanced agents page - using Win11 version only

app.get('/review', (req, res) => {
  res.redirect('/human-review');
});

app.get('/project/:projectId', (req, res) => {
  const project = projects.get(req.params.projectId);
  if (!project) {
    return res.status(404).send(`
      <html>
        <head><title>Project Not Found</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Project Not Found</h1>
          <p>The project with ID ${req.params.projectId} was not found.</p>
          <a href="/dashboard" style="color: #2563eb;">← Back to Dashboard</a>
        </body>
      </html>
    `);
  }
  
  res.redirect(`/dashboard?project=${req.params.projectId}`);
});

// System status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    adkMode: adkMode,
    integration: adkMode === 'google_ai' ? 'Google AI Powered' : 'Standard ADK',
    projectCount: projects.size,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', projectRoutes);
app.use('/api', reviewRoutes);

// Enhanced AI Agents API endpoints
app.get('/api/agents', (req, res) => {
  // Return enhanced agent data with real-time status
  const agentData = getEnhancedAgentData();
  res.json({
    success: true,
    agents: agentData
  });
});

app.get('/api/ai-strategy', (req, res) => {
  // Return current AI strategy and provider status
  const strategy = {
    name: hasGoogle && (hasOpenAI || hasAnthropic) ? 'Enhanced Multi-AI' : 
          hasGoogle ? 'Google AI Powered' : 'Simulation Mode',
    providers: {
      google: !!hasGoogle,
      openai: !!hasOpenAI,
      anthropic: !!hasAnthropic
    },
    timestamp: new Date().toISOString()
  };
  
  res.json({
    success: true,
    strategy: strategy
  });
});

app.get('/api/active-workflows', (req, res) => {
  // Return active workflows from current projects
  const activeWorkflows = [];
  
  projects.forEach((project, projectId) => {
    if (project.status === WORKFLOW_STATES.AGENTS_WORKING) {
      const workflow = {
        projectId: projectId,
        projectName: project.projectName,
        currentPhase: getWorkflowPhase(project.status),
        progress: getWorkflowProgress(project),
        activeAgents: getActiveAgents(project),
        nextStep: getNextStep(project)
      };
      activeWorkflows.push(workflow);
    }
  });
  
  res.json({
    success: true,
    workflows: activeWorkflows
  });
});

// Helper functions for enhanced agent data
function getEnhancedAgentData() {
  return GOOGLE_ADK_AGENTS.map(agent => ({
    ...agent,
    emoji: getAgentEmoji(agent.id),
    totalInteractions: getAgentInteractions(agent.id),
    averageConfidence: getAgentConfidence(agent.id),
    successRate: getAgentSuccessRate(agent.id),
    status: getAgentStatus(agent.id),
    currentTask: getAgentCurrentTask(agent.id),
    recentWork: getAgentRecentWork(agent.id)
  }));
}

function getAgentEmoji(agentId) {
  const emojiMap = {
    'alex-agency-lead': '🎯',
    'riley-research-analyst': '🔍',
    'sam-strategy-lead': '📋',
    'morgan-project-manager': '📅',
    'zara-visual-designer': '🎨',
    'blake-brand-copywriter': '✍️',
    'nova-asset-producer': '📦',
    'taylor-content-creator': '📝',
    'jordan-social-media': '📱',
    'casey-pr-specialist': '📢',
    'quinn-performance-analyst': '📊',
    'dakota-automation-specialist': '🤖'
  };
  return emojiMap[agentId] || '🤖';
}

function getAgentInteractions(agentId) {
  let interactions = 0;
  projects.forEach(project => {
    if (project.agentWork) {
      Object.keys(project.agentWork).forEach(key => {
        if (project.agentWork[key] && project.agentWork[key].agentId === agentId) {
          interactions++;
        }
      });
    }
  });
  return interactions;
}

function getAgentConfidence(agentId) {
  let totalConfidence = 0;
  let count = 0;
  
  projects.forEach(project => {
    if (project.agentWork) {
      Object.keys(project.agentWork).forEach(key => {
        const work = project.agentWork[key];
        if (work && work.agentId === agentId && work.result && work.result.confidenceLevel) {
          totalConfidence += work.result.confidenceLevel;
          count++;
        }
      });
    }
  });
  
  return count > 0 ? totalConfidence / count : 85; // Default confidence
}

function getAgentSuccessRate(agentId) {
  // Calculate success rate based on completed projects
  const interactions = getAgentInteractions(agentId);
  return interactions > 0 ? Math.min(95, 85 + (interactions * 2)) : 95;
}

function getAgentStatus(agentId) {
  // Check if agent is currently working on any project
  for (let [projectId, project] of projects) {
    if (project.status === WORKFLOW_STATES.AGENTS_WORKING) {
      return 'busy';
    }
  }
  return 'available';
}

function getAgentCurrentTask(agentId) {
  // Get current task for busy agents
  for (let [projectId, project] of projects) {
    if (project.status === WORKFLOW_STATES.AGENTS_WORKING) {
      return `Working on ${project.projectName}`;
    }
  }
  return 'Ready';
}

function getAgentRecentWork(agentId) {
  // Get most recent work output
  let mostRecentWork = null;
  let mostRecentTime = 0;
  
  projects.forEach(project => {
    if (project.agentWork) {
      Object.keys(project.agentWork).forEach(key => {
        const work = project.agentWork[key];
        if (work && work.agentId === agentId && work.timestamp) {
          const workTime = new Date(work.timestamp).getTime();
          if (workTime > mostRecentTime) {
            mostRecentTime = workTime;
            mostRecentWork = getWorkSummary(work);
          }
        }
      });
    }
  });
  
  return mostRecentWork;
}

function getWorkSummary(work) {
  if (work.function === 'analyze_project_brief') {
    return `Analysis: ${work.result.confidenceLevel}% confidence, ${work.result.complexityScore}/10 complexity`;
  } else if (work.function === 'design_logo_concepts') {
    return `Created ${work.result.logoConceptsGenerated} logo concepts`;
  } else if (work.function === 'conduct_market_research') {
    return `Market research: ${work.result.targetAudience?.primary || 'Target audience identified'}`;
  }
  return `Completed ${work.function.replace(/_/g, ' ')}`;
}

function getWorkflowPhase(status) {
  const phaseMap = {
    [WORKFLOW_STATES.BRIEF_SUBMITTED]: 'Initialization',
    [WORKFLOW_STATES.AGENTS_WORKING]: 'Active Processing',
    [WORKFLOW_STATES.AGENT_WORK_COMPLETE]: 'Quality Review',
    [WORKFLOW_STATES.HUMAN_REVIEW]: 'Human Review',
    [WORKFLOW_STATES.COE_REVIEW]: 'Final Approval'
  };
  return phaseMap[status] || 'Unknown';
}

function getWorkflowProgress(project) {
  const progressMap = {
    [WORKFLOW_STATES.BRIEF_SUBMITTED]: 10,
    [WORKFLOW_STATES.AGENTS_WORKING]: 45,
    [WORKFLOW_STATES.AGENT_WORK_COMPLETE]: 70,
    [WORKFLOW_STATES.HUMAN_REVIEW]: 85,
    [WORKFLOW_STATES.COE_REVIEW]: 95,
    [WORKFLOW_STATES.QUOTE_SENT]: 100
  };
  return progressMap[project.status] || 0;
}

function getActiveAgents(project) {
  if (project.status === WORKFLOW_STATES.AGENTS_WORKING) {
    return ['Alex 🎯', 'Riley 🔍', 'Zara 🎨', 'Blake ✍️'];
  }
  return [];
}

function getNextStep(project) {
  if (project.status === WORKFLOW_STATES.AGENTS_WORKING) {
    return 'Completing brand development workflow';
  }
  return 'Awaiting next phase';
}

// Static files (after routes to prevent conflicts)
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 ZUBAID AI Workflow System running on port ${PORT}`);
  console.log(`🔗 Integration Mode: ${adkMode.toUpperCase()}`);
  if (adkMode === 'google_ai') {
    console.log(`🤖 Powered by Google AI (Project: ${process.env.GOOGLE_CLOUD_PROJECT})`);
  }
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`👤 Human Review: http://localhost:${PORT}/human-review`);
  console.log(`✅ CoE Review: http://localhost:${PORT}/coe-review`);
  console.log(`🤖 Agents: http://localhost:${PORT}/agents`);
  console.log(`📈 Status: http://localhost:${PORT}/api/status`);
});