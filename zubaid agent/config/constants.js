// Configuration constants for the AI Agency Workflow System

const WORKFLOW_STATES = {
  BRIEF_SUBMITTED: 'brief_submitted',
  AGENTS_WORKING: 'agents_working', 
  AGENT_WORK_COMPLETE: 'agent_work_complete',
  HUMAN_REVIEW: 'human_review',
  HUMAN_APPROVED: 'human_approved',
  COE_REVIEW: 'coe_review',
  COE_APPROVED: 'coe_approved',
  QUOTE_SENT: 'quote_sent'
};

const ZUBAID_AI_TEAM = {
  // ZUBAID's Creative Leadership Team (Tier 1)
  'alex-creative-director': { 
    name: 'Alex (Creative Director) 🎨', 
    functions: ['analyze_project_brief', 'set_visual_strategy', 'coordinate_team_collaboration', 'track_project_progress'],
    tier: 1, 
    rate: 10, 
    role: 'Creative vision and visual strategy for Adobe Express projects',
    specialization: 'Adobe Express visual direction and creative strategy'
  },
  'blake-content-strategist': { 
    name: 'Blake (Content Strategist) 📝', 
    functions: ['develop_messaging', 'create_headlines', 'craft_copy', 'generate_cta'],
    tier: 1, 
    rate: 9, 
    role: 'Compelling messaging and content creation for Adobe Express',
    specialization: 'Content strategy and copywriting for digital designs'
  },
  'zara-visual-designer': {
    name: 'Zara (Visual Designer) 🎯',
    functions: ['create_layouts', 'design_visual_elements', 'apply_typography', 'build_compositions'],
    tier: 1,
    rate: 12,
    role: 'Layout design and visual element creation in Adobe Express',
    specialization: 'Adobe Express layout design and visual composition'
  },
  
  // ZUBAID's Quality & Optimization Team (Tier 2)
  'nova-brand-guardian': {
    name: 'Nova (Brand Guardian) 🛡️',
    functions: ['ensure_consistency', 'quality_assurance', 'brand_compliance', 'accessibility_check'],
    tier: 2,
    rate: 8,
    role: 'Brand consistency and quality assurance across Adobe Express designs',
    specialization: 'Brand standards and design quality control'
  },
  'morgan-platform-optimizer': { 
    name: 'Morgan (Platform Optimizer) 📱', 
    functions: ['optimize_platforms', 'adapt_sizing', 'format_variations', 'export_optimization'],
    tier: 2, 
    rate: 8, 
    role: 'Multi-platform optimization and format adaptation',
    specialization: 'Platform-specific optimization for social media and web'
  },
  'riley-quality-assurance': { 
    name: 'Riley (Quality Assurance) ✅', 
    functions: ['final_review', 'performance_check', 'compatibility_test', 'delivery_preparation'],
    tier: 2, 
    rate: 7, 
    role: 'Final quality review and delivery preparation',
    specialization: 'Quality assurance and project completion'
  }
};

// Legacy support - map to new ZUBAID team structure
const GOOGLE_ADK_AGENTS = ZUBAID_AI_TEAM;

const BILLING_RATES = {
  HUMAN_REVIEW: 25,
  COE_REVIEW: 75,
  ITERATION_PENALTY_LOW: 8,    // Iterations 3-5
  ITERATION_PENALTY_HIGH: 15,  // Iterations 6+
  COMPLEXITY_MULTIPLIERS: {
    LOW: 1.1,     // < $50K
    MEDIUM: 1.3,  // $50K-$100K  
    HIGH: 1.5     // > $100K
  }
};

const DELIVERY_ADJUSTMENTS = {
  STANDARD: 1.0,
  EXPEDITED: 1.2,
  RUSH: 1.5,
  EXTENDED: 0.9
};

const CONFIDENCE_THRESHOLDS = {
  HUMAN_REVIEW_REQUIRED: 90,
  AUTO_APPROVE: 95,
  HIGH_RISK: 80
};

module.exports = {
  WORKFLOW_STATES,
  ZUBAID_AI_TEAM,
  GOOGLE_ADK_AGENTS, // Legacy support
  BILLING_RATES,
  DELIVERY_ADJUSTMENTS,
  CONFIDENCE_THRESHOLDS
};