// ==========================================
// FIXED HUMAN COGNITIVE DECISION MODEL
// ==========================================

import { parseNaturalLanguagePolicy } from './cognitive_levels/policyParserAgent.js';
import { calculateRelevance } from './cognitive_levels/relevanceCalculator.js';
import { calculateEconomicImpact } from './cognitive_levels/economicImpactCalculator.js';
import { calculateSocialImpact } from './cognitive_levels/socialImpactCalculator.js';
import { calculateConvenienceImpact } from './cognitive_levels/convenienceImpactCalculator.js';
import { calculateHealthEnvironmentImpact } from './cognitive_levels/healthEnvironmentImpactCalculator.js';



// ==========================================
// FIXED AGENT 1: PERCEPTION LAYER
// ==========================================

async function parsePolicy(policy) {
  if (typeof policy === 'string') {
    return await parseNaturalLanguagePolicy(policy);
  }
  if (typeof policy === 'object' && policy !== null) {
    return policy;
  }
  throw new Error('Policy must be either a string or structured object');
}





// ==========================================
// FIXED WEIGHT CALCULATION
// ==========================================

function calculatePersonalizedWeights(human, policy) {
  const income = human.socioEconomic?.incomePerCapita || 1000;
  const eduLevel = human.socioEconomic?.educationLevel || 1;
  
  let weights = {
    economic: 0.6,    // Start with high economic weight
    social: 0.2,
    convenience: 0.1,
    healthEnv: 0.1
  };
  
  // POVERTY EFFECT: Poor people care almost only about economics
  if (income < 3000) {
    weights.economic = 0.85;
    weights.social = 0.1;
    weights.convenience = 0.03;
    weights.healthEnv = 0.02;
  } 
  // MIDDLE CLASS: Balanced but still economics-focused
  else if (income < 15000) {
    weights.economic = 0.65;
    weights.social = 0.2;
    weights.convenience = 0.1;
    weights.healthEnv = 0.05;
  }
  // RICH: Can afford to care about other things
  else {
    weights. economic = 0.4;
    weights.social = 0.3;
    weights. convenience = 0.15;
    weights.healthEnv = 0.15;
  }
  
  // Education effect: Educated people care more about environment/social issues
  if (eduLevel >= 3) {
    weights.healthEnv += 0.1;
    weights.social += 0.1;
    weights.economic -= 0.2;
  }
  
  // Normalize weights to sum to 1
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach(k => weights[k] /= total);
  
  return weights;
}

// ==========================================
// FIXED PSYCHOLOGICAL BIASES
// ==========================================

function applyPsychologicalBiases(rawScore, human, policy) {
  let adjustedScore = rawScore;
  
  // Loss aversion (stronger for losses)
  if (rawScore < 0) {
    const lossAversion = 2.0 - ((human.behavioral?.riskTolerance || 3) / 5) * 0.5;
    adjustedScore *= lossAversion;
  }
  
  // Status quo bias (resistance to change)
  const changeAdaptability = human.behavioral?.changeAdaptability || 3;
  const statusQuoBias = (6 - changeAdaptability) / 10; // 0 to 0.5
  
  if (adjustedScore > 0) {
    adjustedScore *= (1 - statusQuoBias); // Reduce positive change
  } else {
    adjustedScore *= (1 + statusQuoBias); // Amplify negative change
  }
  
  return Math.max(-1, Math.min(1, adjustedScore));
}

// ==========================================
// FIXED CONFIDENCE CALCULATION
// ==========================================

function calculateConfidence(human, policy, relevance) {
  let confidence = 0.4; // Lower base confidence
  
  // Higher confidence factors
  confidence += ((human.information?.policyAwareness || 2) / 5) * 0.2;
  confidence += relevance * 0.2; // Higher relevance = more certain
  confidence += ((human.socioEconomic?.educationLevel || 1) / 4) * 0.15;
  
  // Lower confidence factors  
  confidence -= (1 - (human.behavioral?.institutionalTrust || 50) / 100) * 0.15;
  
  return Math.max(0.2, Math.min(0.9, confidence));
}

// ==========================================
// FIXED REASONING GENERATOR
// ==========================================

function generateReasoning(human, policy, scores) {
  const reasons = [];
  const income = human.socioEconomic?.incomePerCapita || 1000;
  
  // Economic reasoning (most important for most people)
  if (Math.abs(scores.economic. economicScore) > 0.2) {
    if (scores.economic.economicScore < -0.3) {
      if (income < 5000) {
        reasons.push(`cannot afford this on my limited income`);
      } else {
        reasons.push(`this would strain my household budget`);
      }
    } else if (scores.economic. economicScore > 0.3) {
      reasons.push(`would benefit financially from this policy`);
    }
  }
  
  // Trust reasoning
  if ((human.behavioral?.institutionalTrust || 50) < 40) {
    reasons.push(`don't trust the government will implement this properly`);
  }
  
  // Social reasoning
  if (scores.social > 0.2) {
    reasons.push(`this policy helps people like me`);
  }
  
  // Default reasoning
  if (reasons.length === 0) {
    if (scores.finalScore > 0.1) {
      reasons.push(`think this policy makes sense`);
    } else if (scores.finalScore < -0.1) {
      reasons. push(`have concerns about this policy`);
    } else {
      reasons.push(`am unsure about the effects`);
    }
  }
  
  const sentiment = scores.finalScore > 0.15 ? "I support this because" : 
                   scores.finalScore < -0.15 ? "I oppose this because" :
                   "I'm neutral because";
  
  return `${sentiment} I ${reasons.join(' and I ')}.`;
}

// ==========================================
// FIXED MASTER FUNCTION
// ==========================================

async function calculateHumanOpinion(human, policy) {
  if (!human || !policy) {
    throw new Error('Human profile and policy are required');
  }
  
  // Parse policy if needed
  let parsedPolicy;
  if (typeof policy === 'string') {
    parsedPolicy = await parsePolicy(policy);
  } else {
    parsedPolicy = policy;
  }
  
  // Calculate relevance
  const relevance = calculateRelevance(human, parsedPolicy);
  
  // Calculate impacts
  const economic = calculateEconomicImpact(human, parsedPolicy);
  const social = calculateSocialImpact(human, parsedPolicy);
  const convenience = calculateConvenienceImpact(human, parsedPolicy);
  const healthEnv = calculateHealthEnvironmentImpact(human, parsedPolicy);
  
  // Calculate personalized weights
  const weights = calculatePersonalizedWeights(human, parsedPolicy);
  

  // Aggregate weighted score
  let rawScore = 
    economic.economicScore * weights.economic +
    social * weights.social +
    convenience * weights.convenience +
    healthEnv * weights.healthEnv;
  
  // Apply psychological biases
  let finalScore = applyPsychologicalBiases(rawScore, human, parsedPolicy);
  
  // CRITICAL FIX: Apply relevance as a dampening factor
  // If policy isn't relevant to you, your opinion should be weaker
  finalScore *= relevance;
  
  // Calculate confidence
  const confidence = calculateConfidence(human, parsedPolicy, relevance);
  
  // Generate reasoning
  const reasoning = generateReasoning(human, parsedPolicy, {
    economic,
    social,
    convenience,
    healthEnv,
    finalScore
  });
  
  // FIXED DECISION THRESHOLDS
  const decision = finalScore > 0.1 ?  'SUPPORT' : 
                  finalScore < -0.1 ? 'OPPOSE' : 
                  'NEUTRAL';
  

  return {
    opinion: finalScore,
    confidence: confidence,
    reasoning: reasoning,
    breakdown: {
      economicScore: economic.economicScore,
      socialScore: social,
      convenienceScore: convenience,
      healthEnvScore: healthEnv,
      relevance: relevance,
      weights: weights
    },
    decision: decision,
    metadata: {
      policy: parsedPolicy. title || 'Policy Analysis',
      domain: parsedPolicy.domain || 'general',
      timestamp: new Date().toISOString(),
      humanId: human.humanId || human.id
    }
  };
}

// Export
export {
  calculateHumanOpinion,
  parsePolicy,
  calculateRelevance,
  calculateEconomicImpact,
  calculateSocialImpact,
  calculateConvenienceImpact,
  calculateHealthEnvironmentImpact,
  calculatePersonalizedWeights,
  applyPsychologicalBiases,
  calculateConfidence,
  generateReasoning
};