// Billing and Quote Generation Service

const { BILLING_RATES, DELIVERY_ADJUSTMENTS, WORKFLOW_STATES } = require('../config/constants');

/**
 * Generate and send final quote to client
 */
function generateAndSendQuote(projectId, quoteAdjustments = {}, { projects, io }) {
  const project = projects.get(projectId);
  if (!project) return;

  const priceMultiplier = quoteAdjustments.priceMultiplier || 1.0;
  const deliveryOption = quoteAdjustments.deliveryOption || 'standard';
  
  let complexityMultiplier = getComplexityMultiplier(project.budget);
  
  // Apply delivery adjustments
  const deliveryMultiplier = DELIVERY_ADJUSTMENTS[deliveryOption.toUpperCase()] || 1.0;
  complexityMultiplier *= deliveryMultiplier;
  
  const iterationPenalty = calculateIterationPenalty(project.iterations);
  const baseCost = project.currentCost * priceMultiplier;
  
  const finalQuote = {
    projectId,
    baseCost: project.currentCost,
    priceAdjustment: priceMultiplier,
    complexityMultiplier,
    iterationPenalty,
    deliveryOption: deliveryOption,
    totalCost: (baseCost * complexityMultiplier) + iterationPenalty,
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    notes: quoteAdjustments.notes || '',
    margin: calculateMargin(baseCost, complexityMultiplier, iterationPenalty)
  };

  project.status = WORKFLOW_STATES.QUOTE_SENT;
  project.finalQuote = finalQuote;
  project.completedAt = new Date().toISOString();

  console.log(`💰 Quote generated for ${project.projectName}: $${finalQuote.totalCost.toLocaleString()}`);

  io.emit('projectUpdate', { 
    projectId, 
    status: 'quote_sent',
    message: 'Final quote generated and sent to client!',
    finalQuote: finalQuote
  });

  return finalQuote;
}

/**
 * Calculate iteration penalty based on number of iterations
 */
function calculateIterationPenalty(iterations) {
  if (iterations <= 2) return 0;
  if (iterations <= 5) return (iterations - 2) * BILLING_RATES.ITERATION_PENALTY_LOW;
  return ((iterations - 5) * BILLING_RATES.ITERATION_PENALTY_HIGH) + (3 * BILLING_RATES.ITERATION_PENALTY_LOW);
}

/**
 * Get complexity multiplier based on project budget
 */
function getComplexityMultiplier(budget) {
  if (budget > 100000) return BILLING_RATES.COMPLEXITY_MULTIPLIERS.HIGH;
  if (budget > 50000) return BILLING_RATES.COMPLEXITY_MULTIPLIERS.MEDIUM;
  return BILLING_RATES.COMPLEXITY_MULTIPLIERS.LOW;
}

/**
 * Calculate profit margin
 */
function calculateMargin(baseCost, multiplier, penalty) {
  const totalCost = (baseCost * multiplier) + penalty;
  const estimatedDirectCosts = baseCost * 0.1; // Assume 10% direct costs
  const margin = ((totalCost - estimatedDirectCosts) / totalCost) * 100;
  return Math.round(margin * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate estimated project cost before final quote
 */
function calculateEstimatedCost(project) {
  const complexityMultiplier = getComplexityMultiplier(project.budget);
  const iterationPenalty = calculateIterationPenalty(project.iterations || 0);
  return (project.currentCost * complexityMultiplier) + iterationPenalty;
}

/**
 * Generate cost breakdown for display
 */
function generateCostBreakdown(project) {
  const baseCost = project.currentCost || 0;
  const complexityMultiplier = getComplexityMultiplier(project.budget);
  const iterationPenalty = calculateIterationPenalty(project.iterations || 0);
  const complexityAdjustment = baseCost * (complexityMultiplier - 1);
  const totalCost = (baseCost * complexityMultiplier) + iterationPenalty;

  return {
    baseCost,
    complexityMultiplier,
    complexityAdjustment,
    iterationPenalty,
    totalCost,
    margin: calculateMargin(baseCost, complexityMultiplier, iterationPenalty),
    breakdown: [
      { item: 'AI Agent Work', amount: baseCost },
      { item: 'Complexity Adjustment', amount: complexityAdjustment },
      { item: 'Iteration Penalty', amount: iterationPenalty },
      { item: 'Total Estimated Cost', amount: totalCost, isTotal: true }
    ]
  };
}

/**
 * Apply pricing adjustments for special cases
 */
function applyPricingAdjustments(baseCost, adjustments = {}) {
  let adjustedCost = baseCost;
  
  // Volume discount for large projects
  if (baseCost > 50000) {
    adjustedCost *= 0.95; // 5% volume discount
  }
  
  // Rush delivery premium
  if (adjustments.rush) {
    adjustedCost *= 1.5;
  }
  
  // Loyalty discount for repeat clients
  if (adjustments.loyaltyDiscount) {
    adjustedCost *= 0.9;
  }
  
  return adjustedCost;
}

/**
 * Validate quote parameters
 */
function validateQuoteParameters(project, adjustments) {
  const errors = [];
  
  if (!project) {
    errors.push('Project not found');
  }
  
  if (adjustments.priceMultiplier && (adjustments.priceMultiplier < 0.5 || adjustments.priceMultiplier > 2.0)) {
    errors.push('Price multiplier must be between 0.5 and 2.0');
  }
  
  if (adjustments.deliveryOption && !Object.keys(DELIVERY_ADJUSTMENTS).includes(adjustments.deliveryOption.toUpperCase())) {
    errors.push('Invalid delivery option');
  }
  
  return errors;
}

module.exports = {
  generateAndSendQuote,
  calculateIterationPenalty,
  getComplexityMultiplier,
  calculateEstimatedCost,
  generateCostBreakdown,
  applyPricingAdjustments,
  validateQuoteParameters
};