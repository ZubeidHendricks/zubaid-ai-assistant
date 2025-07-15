// Enhanced AI Service - Multi-Provider Brand Agency System
// Combines Google AI, OpenAI, and Anthropic for optimal results

const { GoogleAIPoweredADKClient } = require('./googleAIService');
const { MultiAIService } = require('./multiAIService');
const { WORKFLOW_STATES } = require('../config/constants');

/**
 * Enhanced AI Service that intelligently routes tasks to the best AI provider
 * Falls back gracefully if certain providers are unavailable
 */
class EnhancedAIService {
  constructor() {
    // Initialize multi-AI service (handles all providers including Google AI)
    this.multiAIService = new MultiAIService();
    
    // Check which providers are available
    this.providerStatus = this.multiAIService.getProviderStatus();
    
    console.log('🚀 Enhanced AI Service Initialized');
    console.log('📊 Provider Status:', this.providerStatus);
    
    // Determine the best strategy
    this.strategy = this.determineStrategy();
    console.log(`🎯 Using Strategy: ${this.strategy}`);
    
    // Create fallback Google AI service only if needed
    this.googleAIService = null;
  }

  // Lazy initialization for fallback Google AI service
  getGoogleAIService() {
    if (!this.googleAIService) {
      this.googleAIService = new GoogleAIPoweredADKClient();
    }
    return this.googleAIService;
  }

  /**
   * Determine the best AI strategy based on available providers
   */
  determineStrategy() {
    if (this.providerStatus.google && this.providerStatus.openai && this.providerStatus.anthropic) {
      return 'MULTI_AI_OPTIMIZED'; // Use all three for specialized tasks
    } else if (this.providerStatus.google && (this.providerStatus.openai || this.providerStatus.anthropic)) {
      return 'HYBRID'; // Use Google AI + one other provider
    } else if (this.providerStatus.google) {
      return 'GOOGLE_AI_ONLY'; // Fallback to working Google AI
    } else {
      return 'SIMULATION'; // Last resort
    }
  }

  /**
   * Execute the complete brand development workflow
   */
  async executeEnhancedWorkflow(projectId, { projects, agentWork, io }) {
    const project = projects.get(projectId);
    if (!project) return;

    project.status = WORKFLOW_STATES.AGENTS_WORKING;
    io.emit('projectUpdate', { 
      projectId, 
      status: 'agents_working',
      message: `Enhanced AI agents (${this.strategy}) processing your brief...`
    });

    try {
      console.log(`🚀 Starting Enhanced AI workflow (${this.strategy}) for project: ${project.projectName}`);

      // Phase 1: Strategic Analysis (Best reasoning AI)
      const strategicPhase = await this.executeStrategicPhase(project, projectId, io);
      
      // Phase 2: Creative Production (Best creative AI)
      const creativePhase = await this.executeCreativePhase(project, projectId, io, strategicPhase);
      
      // Phase 3: Quality Assurance (Best analysis AI)
      const qualityPhase = await this.executeQualityPhase(project, projectId, io, creativePhase);

      // Compile final results
      const enhancedResults = await this.compileResults(strategicPhase, creativePhase, qualityPhase);
      
      // Store and complete workflow
      agentWork.set(projectId, enhancedResults);
      project.agentWork = enhancedResults;
      project.currentCost = enhancedResults.totalCost;
      project.status = WORKFLOW_STATES.AGENT_WORK_COMPLETE;

      console.log(`✅ Enhanced AI workflow completed for project: ${project.projectName}`);

      io.emit('projectUpdate', { 
        projectId, 
        status: 'agent_work_complete',
        message: `Enhanced AI agents completed comprehensive brand development.`,
        agentWork: enhancedResults
      });

      // Move to human review
      project.status = WORKFLOW_STATES.HUMAN_REVIEW;
      io.emit('projectUpdate', { 
        projectId, 
        status: 'human_review',
        message: 'Enhanced AI work ready for human review.',
        needsHumanReview: true
      });

    } catch (error) {
      console.error('❌ Error in Enhanced AI workflow:', error);
      
      // Fallback to Google AI only
      console.log('🔄 Falling back to Google AI workflow...');
      return await this.getGoogleAIService().executeGoogleADKWorkflow(projectId, { projects, agentWork, io });
    }
  }

  /**
   * Phase 1: Strategic Analysis (Anthropic Claude for deep reasoning)
   */
  async executeStrategicPhase(project, projectId, io) {
    console.log('🧠 Phase 1: Strategic Analysis (Advanced Reasoning)');
    
    const results = {};

    // Use best reasoning AI (Anthropic Claude) for analysis
    console.log('🎯 Enhanced AI analyzing project brief...');
    results.analysis = await this.callBestAI('alex', 'analyze_project_brief', {
      brief: project.brief,
      clientName: project.clientName,
      budget: project.budget,
      timeline: project.timeline
    }, 'reasoning');

    io.emit('agentActivity', {
      projectId,
      agentId: 'alex-agency-lead',
      agentName: 'Alex (Agency Lead) 🎯 [Enhanced AI]',
      activity: `Enhanced AI: Deep analysis complete with ${results.analysis.confidenceLevel}% confidence`,
      confidence: results.analysis.confidenceLevel
    });

    // Continue with other strategic tasks...
    results.coordination = await this.callBestAI('alex', 'coordinate_agent_collaboration', {
      requiredAgents: results.analysis.requiredAgents,
      complexity: results.analysis.complexityScore,
      priority: 'high'
    }, 'strategic');

    results.research = await this.callBestAI('riley', 'conduct_market_research', {
      brief: project.brief,
      targetMarket: 'startup ecosystem'
    }, 'strategic');

    results.strategy = await this.callBestAI('sam', 'develop_strategic_framework', {
      clientObjectives: results.analysis.projectScope.primaryObjectives,
      researchResults: results.research
    }, 'strategic');

    results.timeline = await this.callBestAI('morgan', 'create_project_timeline', {
      scope: results.analysis.projectScope,
      timeline: project.timeline,
      resources: results.coordination.assignedAgents
    }, 'strategic');

    return results;
  }

  /**
   * Phase 2: Creative Production (OpenAI GPT-4 for creativity)
   */
  async executeCreativePhase(project, projectId, io, strategicPhase) {
    console.log('🎨 Phase 2: Creative Production (Enhanced Creativity)');
    
    const results = {};

    // Use OpenAI for creative tasks
    results.logoDesign = await this.callBestAI('zara', 'design_logo_concepts', {
      brandName: project.projectName,
      brandValues: strategicPhase.analysis.projectScope.primaryObjectives,
      targetAudience: strategicPhase.research.targetAudience.primary,
      industry: 'startup'
    }, 'creative');

    io.emit('agentActivity', {
      projectId,
      agentId: 'zara-visual-designer',
      agentName: 'Zara (Visual Designer) 🎨 [Enhanced AI]',
      activity: `Enhanced AI: Created ${results.logoDesign.logoConceptsGenerated} innovative logo concepts`,
      confidence: results.logoDesign.confidenceLevel
    });

    // Generate actual logo images if DALL-E is available
    if (this.providerStatus.openai) {
      try {
        results.logoImages = await this.multiAIService.generateImage(
          `Logo for ${project.projectName}: ${results.logoDesign.primaryConcept.description}`,
          'professional brand logo'
        );
        console.log('🖼️ Logo images generated with DALL-E');
      } catch (error) {
        console.log('⚠️ Logo image generation skipped:', error.message);
      }
    }

    // Continue with other creative tasks using best creative AI
    results.colorPalette = await this.callBestAI('zara', 'create_color_palette', {
      brandPersonality: 'innovative, trustworthy, approachable',
      industry: 'startup',
      targetAudience: strategicPhase.research.targetAudience.primary
    }, 'creative');

    results.typography = await this.callBestAI('zara', 'select_typography', {
      brandPersonality: 'innovative, trustworthy, approachable',
      industry: 'startup',
      targetAudience: strategicPhase.research.targetAudience.primary
    }, 'creative');

    results.brandVoice = await this.callBestAI('blake', 'develop_brand_voice', {
      brandValues: strategicPhase.analysis.projectScope.primaryObjectives,
      targetAudience: strategicPhase.research.targetAudience.primary,
      industry: 'startup'
    }, 'creative');

    results.messaging = await this.callBestAI('blake', 'create_messaging_framework', {
      brandValues: strategicPhase.analysis.projectScope.primaryObjectives,
      targetAudience: strategicPhase.research.targetAudience.primary,
      competitorAnalysis: strategicPhase.research.competitorAnalysis
    }, 'creative');

    results.taglines = await this.callBestAI('blake', 'generate_taglines', {
      brandValues: strategicPhase.analysis.projectScope.primaryObjectives,
      brandPersonality: 'innovative, trustworthy, approachable',
      targetAudience: strategicPhase.research.targetAudience.primary
    }, 'creative');

    return results;
  }

  /**
   * Phase 3: Quality Assurance (Best analysis for final review)
   */
  async executeQualityPhase(project, projectId, io, creativePhase) {
    console.log('🔍 Phase 3: Quality Assurance (Advanced Analysis)');
    
    const results = {};

    // Create comprehensive brand guidelines
    results.brandGuidelines = await this.callBestAI('nova', 'create_brand_guidelines', {
      brandName: project.projectName,
      visualIdentity: {
        logo: creativePhase.logoDesign,
        colors: creativePhase.colorPalette,
        typography: creativePhase.typography
      },
      brandVoice: creativePhase.brandVoice
    }, 'reasoning');

    // Final progress tracking with best analysis AI
    results.finalProgress = await this.callBestAI('alex', 'track_project_progress', {
      projectId: projectId,
      collaborationSessionId: `enhanced_${Date.now()}`
    }, 'reasoning');

    io.emit('agentActivity', {
      projectId,
      agentId: 'nova-asset-producer',
      agentName: 'Nova (Asset Producer) 📦 [Enhanced AI]',
      activity: `Enhanced AI: Comprehensive brand guidelines and quality assurance complete`,
      confidence: results.brandGuidelines.confidenceLevel
    });

    return results;
  }

  /**
   * Call the best available AI for a specific task type
   */
  async callBestAI(agentName, functionName, params, preferredType = 'strategic') {
    try {
      // Try multi-AI first if available
      if (this.strategy === 'MULTI_AI_OPTIMIZED' || this.strategy === 'HYBRID') {
        return await this.multiAIService.callAgentFunction(agentName, functionName, params);
      }
    } catch (error) {
      console.log(`⚠️ Multi-AI failed, falling back to Google AI: ${error.message}`);
    }

    // Fallback to Google AI
    return await this.getGoogleAIService().callAgentFunction(agentName, functionName, params);
  }

  /**
   * Compile final results from all phases
   */
  async compileResults(strategicPhase, creativePhase, qualityPhase) {
    return {
      // Strategic Phase
      analysis: {
        agentId: 'alex-agency-lead',
        agentName: 'Alex (Agency Lead) 🎯 [Enhanced AI]',
        function: 'analyze_project_brief',
        result: strategicPhase.analysis,
        timestamp: new Date().toISOString(),
        cost: 10, // Premium pricing for enhanced AI
        source: 'ENHANCED_AI'
      },
      coordination: {
        agentId: 'alex-agency-lead',
        agentName: 'Alex (Agency Lead) 🎯 [Enhanced AI]',
        function: 'coordinate_agent_collaboration',
        result: strategicPhase.coordination,
        timestamp: new Date().toISOString(),
        cost: 8,
        source: 'ENHANCED_AI'
      },
      research: {
        agentId: 'riley-research-analyst',
        agentName: 'Riley (Research Analyst) 🔍 [Enhanced AI]',
        function: 'conduct_market_research',
        result: strategicPhase.research,
        timestamp: new Date().toISOString(),
        cost: 15,
        source: 'ENHANCED_AI'
      },
      strategy: {
        agentId: 'sam-strategy-lead',
        agentName: 'Sam (Strategy Lead) 📋 [Enhanced AI]',
        function: 'develop_strategic_framework',
        result: strategicPhase.strategy,
        timestamp: new Date().toISOString(),
        cost: 12,
        source: 'ENHANCED_AI'
      },
      timeline: {
        agentId: 'morgan-project-manager',
        agentName: 'Morgan (Project Manager) 📅 [Enhanced AI]',
        function: 'create_project_timeline',
        result: strategicPhase.timeline,
        timestamp: new Date().toISOString(),
        cost: 10,
        source: 'ENHANCED_AI'
      },
      
      // Creative Production Phase
      logoDesign: {
        agentId: 'zara-visual-designer',
        agentName: 'Zara (Visual Designer) 🎨 [Enhanced AI]',
        function: 'design_logo_concepts',
        result: creativePhase.logoDesign,
        timestamp: new Date().toISOString(),
        cost: 18, // Premium for creative AI
        source: 'ENHANCED_AI'
      },
      logoImages: creativePhase.logoImages ? {
        agentId: 'zara-visual-designer',
        agentName: 'Zara (Visual Designer) 🎨 [DALL-E]',
        function: 'generate_logo_images',
        result: creativePhase.logoImages,
        timestamp: new Date().toISOString(),
        cost: 25, // Premium for image generation
        source: 'ENHANCED_AI'
      } : null,
      colorPalette: {
        agentId: 'zara-visual-designer',
        agentName: 'Zara (Visual Designer) 🎨 [Enhanced AI]',
        function: 'create_color_palette',
        result: creativePhase.colorPalette,
        timestamp: new Date().toISOString(),
        cost: 12,
        source: 'ENHANCED_AI'
      },
      typography: {
        agentId: 'zara-visual-designer',
        agentName: 'Zara (Visual Designer) 🎨 [Enhanced AI]',
        function: 'select_typography',
        result: creativePhase.typography,
        timestamp: new Date().toISOString(),
        cost: 10,
        source: 'ENHANCED_AI'
      },
      brandVoice: {
        agentId: 'blake-brand-copywriter',
        agentName: 'Blake (Brand Copywriter) ✍️ [Enhanced AI]',
        function: 'develop_brand_voice',
        result: creativePhase.brandVoice,
        timestamp: new Date().toISOString(),
        cost: 15,
        source: 'ENHANCED_AI'
      },
      messaging: {
        agentId: 'blake-brand-copywriter',
        agentName: 'Blake (Brand Copywriter) ✍️ [Enhanced AI]',
        function: 'create_messaging_framework',
        result: creativePhase.messaging,
        timestamp: new Date().toISOString(),
        cost: 12,
        source: 'ENHANCED_AI'
      },
      taglines: {
        agentId: 'blake-brand-copywriter',
        agentName: 'Blake (Brand Copywriter) ✍️ [Enhanced AI]',
        function: 'generate_taglines',
        result: creativePhase.taglines,
        timestamp: new Date().toISOString(),
        cost: 10,
        source: 'ENHANCED_AI'
      },
      
      // Quality Phase
      brandGuidelines: {
        agentId: 'nova-asset-producer',
        agentName: 'Nova (Asset Producer) 📦 [Enhanced AI]',
        function: 'create_brand_guidelines',
        result: qualityPhase.brandGuidelines,
        timestamp: new Date().toISOString(),
        cost: 20,
        source: 'ENHANCED_AI'
      },
      progress: {
        agentId: 'alex-agency-lead',
        agentName: 'Alex (Agency Lead) 🎯 [Enhanced AI]',
        function: 'track_project_progress',
        result: qualityPhase.finalProgress,
        timestamp: new Date().toISOString(),
        cost: 8,
        source: 'ENHANCED_AI'
      },
      
      // Enhanced Summary
      totalCost: creativePhase.logoImages ? 185 : 160, // Higher cost for premium AI
      confidenceLevel: Math.round((
        strategicPhase.analysis.confidenceLevel + 
        creativePhase.logoDesign.confidenceLevel + 
        qualityPhase.brandGuidelines.confidenceLevel
      ) / 3),
      completedAt: new Date().toISOString(),
      source: 'ENHANCED_AI_POWERED',
      phaseSummary: {
        strategicPhase: 'Advanced reasoning AI for deep analysis and strategy',
        creativePhase: 'Creative AI for innovative design and compelling content',
        qualityPhase: 'Quality assurance with comprehensive brand guidelines',
        enhancementFeatures: [
          'Multi-AI provider optimization',
          'Advanced reasoning for analysis',
          'Creative AI for innovation',
          'Image generation capabilities',
          'Premium quality assurance'
        ],
        totalSteps: 13,
        agentsInvolved: 8,
        aiProvidersUsed: this.strategy
      }
    };
  }

  /**
   * Get service status for monitoring
   */
  getServiceStatus() {
    return {
      strategy: this.strategy,
      providers: this.providerStatus,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { EnhancedAIService };