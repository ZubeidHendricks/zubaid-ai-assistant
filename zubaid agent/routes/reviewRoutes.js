// Review-related API routes (Human Review and CoE Review)

const express = require('express');
const { WORKFLOW_STATES, BILLING_RATES } = require('../config/constants');

const router = express.Router();

// Human Review Endpoints
router.post('/projects/:projectId/human-review', (req, res) => {
  try {
    const { decision, adjustments, feedback } = req.body;
    const project = req.app.locals.projects.get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const humanReview = {
      reviewerId: 'human_reviewer',
      decision, // 'approve', 'adjust', 'reject'
      adjustments: adjustments || {},
      feedback: feedback || '',
      reviewedAt: new Date().toISOString(),
      cost: BILLING_RATES.HUMAN_REVIEW
    };

    req.app.locals.humanReviews.set(req.params.projectId, humanReview);
    project.humanReview = humanReview;
    project.currentCost += humanReview.cost;

    console.log(`👤 Human review: ${decision} for project ${project.projectName}`);

    if (decision === 'approve') {
      project.status = WORKFLOW_STATES.HUMAN_APPROVED;
      
      // Move to CoE review
      setTimeout(() => {
        project.status = WORKFLOW_STATES.COE_REVIEW;
        req.app.locals.io.emit('projectUpdate', { 
          projectId: req.params.projectId, 
          status: 'coe_review',
          message: 'Human approved. Ready for CoE final approval.',
          needsCoeReview: true
        });
      }, 1000);

    } else if (decision === 'adjust') {
      project.status = WORKFLOW_STATES.AGENTS_WORKING;
      project.iterations += 1;
      
      // Re-run agents with adjustments
      setTimeout(() => {
        req.app.locals.executeGoogleADKAdjustments(req.params.projectId, adjustments, {
          projects: req.app.locals.projects,
          io: req.app.locals.io
        });
      }, 2000);
    } else if (decision === 'reject') {
      project.status = WORKFLOW_STATES.BRIEF_SUBMITTED;
      project.iterations += 1;
      
      // Could trigger a complete restart or escalation
      req.app.locals.io.emit('projectUpdate', { 
        projectId: req.params.projectId, 
        status: 'rejected',
        message: 'Project rejected by human reviewer. Requires escalation.',
        needsEscalation: true
      });
    }

    req.app.locals.io.emit('projectUpdate', { 
      projectId: req.params.projectId, 
      status: project.status,
      humanReview: humanReview
    });

    res.json({ success: true, message: 'Human review processed successfully' });
  } catch (error) {
    console.error('Error processing human review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Human Review - Approve endpoint
router.post('/human-review/:projectId/approve', (req, res) => {
  try {
    const { decision, feedback } = req.body;
    const project = req.app.locals.projects.get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const humanReview = {
      reviewerId: 'human_reviewer',
      decision: 'approve',
      feedback: feedback || 'Approved for CoE review',
      reviewedAt: new Date().toISOString(),
      cost: BILLING_RATES.HUMAN_REVIEW
    };

    req.app.locals.humanReviews.set(req.params.projectId, humanReview);
    project.humanReview = humanReview;
    project.currentCost += humanReview.cost;
    project.status = WORKFLOW_STATES.HUMAN_APPROVED;

    console.log(`👤 Human review approved for project ${project.projectName}`);

    // Move to CoE review
    setTimeout(() => {
      project.status = WORKFLOW_STATES.COE_REVIEW;
      req.app.locals.io.emit('projectUpdate', { 
        projectId: req.params.projectId, 
        status: 'coe_review',
        message: 'Human approved. Ready for CoE final approval.',
        needsCoeReview: true
      });
    }, 1000);

    req.app.locals.io.emit('projectUpdate', { 
      projectId: req.params.projectId, 
      status: project.status,
      humanReview: humanReview
    });

    res.json({ success: true, message: 'Project approved successfully' });
  } catch (error) {
    console.error('Error approving project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Human Review - Request revisions endpoint
router.post('/human-review/:projectId/revise', (req, res) => {
  try {
    const { decision, feedback } = req.body;
    const project = req.app.locals.projects.get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const humanReview = {
      reviewerId: 'human_reviewer',
      decision: 'revisions_requested',
      feedback: feedback || '',
      reviewedAt: new Date().toISOString(),
      cost: BILLING_RATES.HUMAN_REVIEW
    };

    req.app.locals.humanReviews.set(req.params.projectId, humanReview);
    project.humanReview = humanReview;
    project.currentCost += humanReview.cost;
    project.status = WORKFLOW_STATES.AGENTS_WORKING;
    project.iterations = (project.iterations || 0) + 1;

    console.log(`👤 Human review requested revisions for project ${project.projectName}`);

    // Re-run agents with revisions
    setTimeout(() => {
      req.app.locals.executeGoogleADKAdjustments(req.params.projectId, { feedback }, {
        projects: req.app.locals.projects,
        io: req.app.locals.io
      });
    }, 2000);

    req.app.locals.io.emit('projectUpdate', { 
      projectId: req.params.projectId, 
      status: project.status,
      message: 'Revisions requested. AI agents will rework the project.',
      humanReview: humanReview
    });

    res.json({ success: true, message: 'Revision request submitted successfully' });
  } catch (error) {
    console.error('Error submitting revision request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Human Review - Escalate endpoint
router.post('/human-review/:projectId/escalate', (req, res) => {
  try {
    const { decision, feedback } = req.body;
    const project = req.app.locals.projects.get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const humanReview = {
      reviewerId: 'human_reviewer',
      decision: 'escalated',
      feedback: feedback || '',
      reviewedAt: new Date().toISOString(),
      cost: BILLING_RATES.HUMAN_REVIEW
    };

    req.app.locals.humanReviews.set(req.params.projectId, humanReview);
    project.humanReview = humanReview;
    project.currentCost += humanReview.cost;
    project.status = 'escalated_to_coe';

    console.log(`👤 Human review escalated project ${project.projectName} to CoE`);

    req.app.locals.io.emit('projectUpdate', { 
      projectId: req.params.projectId, 
      status: project.status,
      message: 'Project escalated to Senior CoE for review.',
      humanReview: humanReview,
      needsEscalation: true
    });

    res.json({ success: true, message: 'Project escalated to CoE successfully' });
  } catch (error) {
    console.error('Error escalating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CoE Review Endpoints
router.post('/projects/:projectId/coe-review', (req, res) => {
  try {
    const { decision, feedback, quoteAdjustments } = req.body;
    const project = req.app.locals.projects.get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const coeApproval = {
      reviewerId: 'coe_reviewer',
      decision, // 'approve', 'request_changes', 'escalate'
      feedback: feedback || '',
      quoteAdjustments: quoteAdjustments || {},
      reviewedAt: new Date().toISOString(),
      cost: BILLING_RATES.COE_REVIEW
    };

    req.app.locals.coeApprovals.set(req.params.projectId, coeApproval);
    project.coeApproval = coeApproval;
    project.currentCost += coeApproval.cost;

    console.log(`✅ CoE review: ${decision} for project ${project.projectName}`);

    if (decision === 'approve') {
      project.status = WORKFLOW_STATES.COE_APPROVED;
      
      // Generate final quote and send to client
      setTimeout(() => {
        req.app.locals.generateAndSendQuote(req.params.projectId, quoteAdjustments, {
          projects: req.app.locals.projects,
          io: req.app.locals.io
        });
      }, 1000);

    } else if (decision === 'request_changes') {
      project.status = WORKFLOW_STATES.HUMAN_REVIEW;
      project.iterations += 1;
      
      req.app.locals.io.emit('projectUpdate', { 
        projectId: req.params.projectId, 
        status: 'human_review',
        message: 'CoE requested changes. Back to human review.',
        needsHumanReview: true
      });

    } else if (decision === 'escalate') {
      project.status = 'escalated';
      
      req.app.locals.io.emit('projectUpdate', { 
        projectId: req.params.projectId, 
        status: 'escalated',
        message: 'Project escalated to Senior CoE for review.',
        needsEscalation: true
      });
    }

    req.app.locals.io.emit('projectUpdate', { 
      projectId: req.params.projectId, 
      status: project.status,
      coeApproval: coeApproval
    });

    res.json({ success: true, message: 'CoE review processed successfully' });
  } catch (error) {
    console.error('Error processing CoE review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get review statistics
router.get('/review/stats', (req, res) => {
  try {
    const projects = Array.from(req.app.locals.projects.values());
    const humanReviews = Array.from(req.app.locals.humanReviews.values());
    const coeApprovals = Array.from(req.app.locals.coeApprovals.values());

    const stats = {
      totalProjects: projects.length,
      humanReviewsCompleted: humanReviews.length,
      coeApprovalsCompleted: coeApprovals.length,
      averageIterations: projects.reduce((sum, p) => sum + (p.iterations || 0), 0) / projects.length || 0,
      pendingHumanReview: projects.filter(p => p.status === WORKFLOW_STATES.HUMAN_REVIEW).length,
      pendingCoeReview: projects.filter(p => p.status === WORKFLOW_STATES.COE_REVIEW).length,
      completedProjects: projects.filter(p => p.status === WORKFLOW_STATES.QUOTE_SENT).length
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Batch operations for multiple projects
router.post('/review/batch-approve', (req, res) => {
  try {
    const { projectIds, reviewType } = req.body; // reviewType: 'human' or 'coe'
    
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid project IDs' });
    }

    const results = [];
    
    projectIds.forEach(projectId => {
      const project = req.app.locals.projects.get(projectId);
      if (project) {
        if (reviewType === 'human' && project.status === WORKFLOW_STATES.HUMAN_REVIEW) {
          // Auto-approve for human review
          project.status = WORKFLOW_STATES.HUMAN_APPROVED;
          results.push({ projectId, status: 'approved' });
        } else if (reviewType === 'coe' && project.status === WORKFLOW_STATES.COE_REVIEW) {
          // Auto-approve for CoE review
          project.status = WORKFLOW_STATES.COE_APPROVED;
          results.push({ projectId, status: 'approved' });
        } else {
          results.push({ projectId, status: 'skipped', reason: 'Invalid status' });
        }
      } else {
        results.push({ projectId, status: 'not_found' });
      }
    });

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error in batch approve:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Emergency project reset (for development/testing)
router.post('/projects/:projectId/reset', (req, res) => {
  try {
    const project = req.app.locals.projects.get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Reset project to initial state
    project.status = WORKFLOW_STATES.BRIEF_SUBMITTED;
    project.currentCost = 0;
    project.iterations = 0;
    project.agentWork = null;
    project.humanReview = null;
    project.coeApproval = null;
    project.error = null;

    // Clear related data
    req.app.locals.agentWork.delete(req.params.projectId);
    req.app.locals.humanReviews.delete(req.params.projectId);
    req.app.locals.coeApprovals.delete(req.params.projectId);

    console.log(`🔄 Reset project: ${project.projectName}`);

    req.app.locals.io.emit('projectUpdate', { 
      projectId: req.params.projectId, 
      status: 'reset',
      message: 'Project reset to initial state'
    });

    res.json({ success: true, message: 'Project reset successfully' });
  } catch (error) {
    console.error('Error resetting project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;