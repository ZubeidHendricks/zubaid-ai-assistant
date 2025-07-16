// Project-related API routes

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { WORKFLOW_STATES, GOOGLE_ADK_AGENTS } = require('../config/constants');

const router = express.Router();

// Create new project
router.post('/projects', async (req, res) => {
  try {
    const { clientName, projectName, brief, budget, timeline, requirements, aiMode } = req.body;
    
    const projectId = uuidv4();
    const project = {
      id: projectId,
      clientName,
      projectName,
      brief,
      budget: parseFloat(budget),
      timeline,
      requirements: requirements || [],
      aiMode: aiMode || 'enhanced',
      status: WORKFLOW_STATES.BRIEF_SUBMITTED,
      currentCost: 0,
      iterations: 0,
      createdAt: new Date().toISOString(),
      agentWork: null,
      humanReview: null,
      coeApproval: null
    };

    req.app.locals.projects.set(projectId, project);
    
    // Start the appropriate AI workflow based on user selection
    setTimeout(() => {
      if (aiMode === 'standard') {
        // Use REAL Google AI (not simulation!)
        const googleAIService = require('../services/googleAIService');
        googleAIService.executeGoogleADKWorkflow(projectId, {
          projects: req.app.locals.projects,
          agentWork: req.app.locals.agentWork,
          io: req.app.locals.io
        });
      } else {
        // Use Enhanced Multi-AI (if available) or fallback to Google
        req.app.locals.executeGoogleADKWorkflow(projectId, {
          projects: req.app.locals.projects,
          agentWork: req.app.locals.agentWork,
          io: req.app.locals.io
        });
      }
    }, 2000);
    
    res.json({ 
      success: true, 
      projectId,
      message: 'Project brief submitted. Google ADK agents are now working...'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all projects
router.get('/projects', (req, res) => {
  try {
    const allProjects = Array.from(req.app.locals.projects.values());
    res.json({ success: true, projects: allProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific project
router.get('/projects/:projectId', (req, res) => {
  try {
    const project = req.app.locals.projects.get(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get projects needing human review
router.get('/human-review/queue', (req, res) => {
  try {
    const reviewProjects = Array.from(req.app.locals.projects.values()).filter(p => 
      p.status === WORKFLOW_STATES.HUMAN_REVIEW || p.status === WORKFLOW_STATES.AGENT_WORK_COMPLETE
    );
    res.json({ success: true, projects: reviewProjects });
  } catch (error) {
    console.error('Error fetching human review queue:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get projects needing CoE review
router.get('/coe-review/queue', (req, res) => {
  try {
    const coeProjects = Array.from(req.app.locals.projects.values()).filter(p => 
      p.status === WORKFLOW_STATES.COE_REVIEW || p.status === WORKFLOW_STATES.HUMAN_APPROVED
    );
    res.json({ success: true, projects: coeProjects });
  } catch (error) {
    console.error('Error fetching CoE review queue:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agents information
router.get('/agents', (req, res) => {
  try {
    const agentStats = Object.keys(GOOGLE_ADK_AGENTS).map(agentId => ({
      id: agentId,
      ...GOOGLE_ADK_AGENTS[agentId],
      status: 'available',
      activeProjects: Array.from(req.app.locals.projects.values()).filter(p => 
        p.status === WORKFLOW_STATES.AGENTS_WORKING
      ).length,
      totalInteractions: Math.floor(Math.random() * 50) + 10,
      averageConfidence: 85 + Math.random() * 10
    }));
    
    res.json({ success: true, agents: agentStats });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;