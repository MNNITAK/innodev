/**
 * RELEVANCE CALCULATOR - COMPREHENSIVE & IMPROVED
 * Analyzes how relevant a policy is to a specific person
 * Considers 50+ human factors across 13 policy domains
 * Based on extensive UP.json data analysis (15 new conditions added)
 */



/**
 * Calculate how relevant a policy is to a specific person
 * @param {Object} human - Human with all demographic/socio-economic data
 * @param {Object} policy - Parsed policy with domain and impacts
 * @returns {number} Relevance score (0-1)
 */
function calculateRelevance(human, policy) {
  let relevance = 0.02; // Base relevance (minimum)
  
  const domain = policy.domain?.toLowerCase() || 'general';
  
  // ========== EXTRACT ALL HUMAN FACTORS ==========
  // Demographics (Section 1)
  const income = human.socioEconomic?.incomePerCapita || 1000;
  const age = human.demographics?.age || 35;
  const occupation = human.socioEconomic?.occupation?.toLowerCase() || '';
  const urbanization = human.demographics?.urbanization?.toLowerCase() || '';
  const educationLevel = human.socioEconomic?.educationLevel || 1;
  const employment = human.socioEconomic?.employmentType?.toLowerCase() || 'informal';
  const literacy = human.socioEconomic?.literacy || 0;
  const povertStatus = human.socioEconomic?.povertyStatus || 0;
  const gender = human.demographics?.gender?.toLowerCase() || 'male';
  const householdSize = human.demographics?.dependents || 0;
  const religion = human.demographics?.religion?.toLowerCase() || 'hindu';
  const casteGroup = human.demographics?.casteGroup?.toLowerCase() || 'general';
  const sexRatio = human.demographics?.sexRatio || 0.5; // NEW: Gender imbalance
  
  // Socio-Economic (Section 2)
  const wealthQuintile = human.socioEconomic?.wealthQuintileQ1 || 0.15; // NEW: Bottom 20% wealth
  
  // Behavioral (Section 3) - NEW CRITICAL FACTORS
  const institutionalTrust = human.behavioral?.institutionalTrust || 50; // NEW: 0-100 scale
  const riskTolerance = human.behavioral?.riskTolerance || 0.5; // NEW: 0-1 scale
  const changeAdaptability = human.behavioral?.changeAdaptability || 0.5; // NEW: 0-1 scale
  const castConsciousness = human.behavioral?.casteConsciousness || 0.5;
  
  // Health (Section 4)
  const diseaseRisk = human.health?.diseaseRisk || 30;
  const healthLiteracy = human.health?.healthLiteracy || 0;
  const healthcareAccess = human.health?.healthcareAccess || 0.5; // NEW: 0-1 access scale
  const nutritionStatus = human.health?.nutritionStatus || 0;
  
  // Financial (Section 5)
  const incomeStability = human.financial?.incomeStability || 0.5; // NEW: Better utilized
  const debtVulnerability = human.financial?.debtVulnerability || 0;
  const savingsRate = human.financial?.savingsRate || 0;
  
  // Housing (Section 6)
  const housingType = human.housing?.housingType?.toLowerCase() || 'pucca';
  const housingCost = human.housing?.housingCostBurden || 0;
  
  // Mobility & Transport (Section 7)
  const commute = human.mobility?.commuteTime || 30;
  const transportMode = human.mobility?.transportationMode?.toLowerCase() || 'walking';
  const mobilityScale = human.mobility?.geographicMobility || 0;
  
  // Civic & Legal (Section 9, 12)
  const votingBehavior = human.civic?.votingBehavior || 0;
  const civicParticipation = human.civic?.civicParticipation || 0;
  const mediaConsumption = human.civic?.mediaConsumption || 0;
  const policyAwareness = human.civic?.policyAwareness || 0; // NEW: Critical factor
  const criminalRecord = human.civic?.criminalRecord || 0; // NEW: 0.01-0.04 range
  
  // Digital & Tech (Section 10)
  const internetConnectivity = human.digital?.internetConnectivity || 0;
  const digitalLiteracy = human.digital?.digitalLiteracy || 0;
  const digitalServicesAccess = human.digital?.digitalServicesAccess || 0;
  
  // Environment (Section 11)
  const pollutionExposure = human.environment?.pollutionExposure || 0;
  const climateVulnerability = human.environment?.climateVulnerability || 0;
  const greenSpaceAccess = human.environment?.greenSpaceAccess || 0;
  
  const costImpact = Math.abs(policy.impacts?.economicCost || 0);
  // ========== UNIVERSAL RELEVANCE MULTIPLIERS ==========
  // Applied to all domains - CRITICAL NEW ADDITION
  
  // 1. INSTITUTIONAL TRUST MULTIPLIER (0.25-0.75 range in UP data)
  // Low trust = paradoxically HIGH relevance (skeptics watch carefully)
  let trustMultiplier = 1.0;
  if (institutionalTrust < 40) {
    trustMultiplier = 1.3; // Skeptics pay MORE attention
  } else if (institutionalTrust < 50) {
    trustMultiplier = 1.15;
  } else if (institutionalTrust > 70) {
    trustMultiplier = 0.9; // Trusting people less vigilant
  }
  
  // 2. RISK TOLERANCE MULTIPLIER (0.0-0.75 range)
  // Low risk tolerance = resistant, high relevance to avoid risk
  let riskMultiplier = 1.0;
  if (riskTolerance < 0.25) {
    riskMultiplier = 1.4; // Highly risk-averse - policies matter MORE
  } else if (riskTolerance < 0.5) {
    riskMultiplier = 1.2;
  } else if (riskTolerance > 0.65) {
    riskMultiplier = 0.85; // Risk-takers less concerned about policy risks
  }
  
  // 3. CHANGE ADAPTABILITY MULTIPLIER (0.0-0.75 range)
  // Low adaptability = resistant to change, cares more about policy stability
  let adaptMultiplier = 1.0;
  if (changeAdaptability < 0.25) {
    adaptMultiplier = 1.35; // Highly rigid - opposes changes
  } else if (changeAdaptability < 0.5) {
    adaptMultiplier = 1.15;
  } else if (changeAdaptability > 0.65) {
    adaptMultiplier = 0.9; // Adaptable - less concerned about disruption
  }
  
  // 4. POLICY AWARENESS MULTIPLIER (0.0-0.75 range)
  // No awareness = low relevance (doesn't know about policy)
  let awarenessMultiplier = 1.0;
  if (policyAwareness < 0.2) {
    awarenessMultiplier = 0.5; // Ignorant of policy = low relevance
  } else if (policyAwareness < 0.4) {
    awarenessMultiplier = 0.75;
  } else if (policyAwareness > 0.6) {
    awarenessMultiplier = 1.25; // Well-informed = higher relevance
  }
  
  // Apply universal multipliers
  const universalMultiplier = trustMultiplier * riskMultiplier * adaptMultiplier * awarenessMultiplier;
  
  // ========== TRANSPORT DOMAIN ==========
  if (domain === 'transport') {
    relevance += 0.05; // Base for transport
    
    // Transportation mode - includes ALL modes found in UP data
    if (transportMode === 'car' || transportMode === 'private vehicle') relevance += 0.65;
    else if (transportMode === 'bus' || transportMode === 'public bus') relevance += 0.50;
    else if (transportMode === 'train' || transportMode === 'railway') relevance += 0.45;
    else if (transportMode === 'auto' || transportMode === 'auto rickshaw') relevance += 0.48;
    else if (transportMode === 'motorcycle' || transportMode === 'bike') relevance += 0.42;
    else if (transportMode === 'cycle' || transportMode === 'bicycle') relevance += 0.40;
    else if (transportMode === 'walking') relevance += 0.35;
    
    // Commute time
    if (commute > 60) relevance += 0.30;
    else if (commute > 30) relevance += 0.20;
    else relevance += 0.10;
    
    // Urbanization
    if (urbanization === 'urban') relevance += 0.25;
    else if (urbanization === 'semi-urban') relevance += 0.15;
    else relevance += 0.08;
    
    // Daily commuter occupation
    if (occupation === 'service sector' || occupation === 'office' || occupation === 'student') relevance += 0.20;
    else if (occupation === 'business' || occupation === 'entrepreneur') relevance += 0.15;
    
    // Income sensitivity
    if (income < 5000) relevance += 0.25;
    else if (income < 15000) relevance += 0.15;
    else relevance += 0.05;
    
    // Geographic mobility
    if (mobilityScale > 0.7) relevance += 0.15;
    else if (mobilityScale > 0.3) relevance += 0.08;
    
    // Income stability affects transport choices
    if (incomeStability < 0.3) relevance += 0.12; // Unstable = uses cheap transport
    
    // Risk tolerance: risk-averse avoid new transport modes
    if (riskTolerance < 0.3) relevance += 0.10;
    
    relevance *= universalMultiplier;
  }
  
  // ========== HEALTH DOMAIN ==========
  else if (domain === 'health') {
    relevance += 0.05;
    
    // Age - PRIMARY factor
    if (age >= 60) relevance += 0.50;
    else if (age >= 50) relevance += 0.35;
    else if (age >= 40) relevance += 0.25;
    else if (age >= 30) relevance += 0.15;
    else relevance += 0.08;
    
    // Disease risk
    if (diseaseRisk > 70) relevance += 0.45;
    else if (diseaseRisk > 50) relevance += 0.35;
    else if (diseaseRisk > 30) relevance += 0.20;
    else relevance += 0.08;
    
    // Healthcare access - NEW CRITICAL FACTOR
    // Ranges from 0 (no access) to 1 (full access)
    if (healthcareAccess < 0.25) relevance += 0.35; // No access = needs policies urgently
    else if (healthcareAccess < 0.5) relevance += 0.25;
    else if (healthcareAccess < 0.75) relevance += 0.15;
    else relevance += 0.08; // Full access = less relevant
    
    // Health literacy
    if (healthLiteracy > 0.7) relevance += 0.15;
    else if (healthLiteracy > 0.3) relevance += 0.08;
    
    // Nutrition status
    if (nutritionStatus < 0.3) relevance += 0.20;
    
    // Household size (caring for dependents)
    if (householdSize >= 4) relevance += 0.20;
    else if (householdSize >= 2) relevance += 0.10;
    
    // Gender (women caretakers)
    if (gender === 'female') relevance += 0.15;
    
    // Poverty
    if (povertStatus === 1) relevance += 0.25;
    
    // Income
    if (income < 5000) relevance += 0.20;
    else if (income < 15000) relevance += 0.12;
    
    // Debt vulnerability - affects health spending
    if (debtVulnerability > 0.5) relevance += 0.15;
    
    // Risk tolerance: conservative want proven treatments
    if (riskTolerance < 0.3) relevance += 0.12;
    
    relevance *= universalMultiplier;
  }
  
  // ========== EDUCATION DOMAIN ==========
  else if (domain === 'education') {
    relevance += 0.05;
    
    // Having children - PRIMARY
    if (householdSize > 0) relevance += 0.45;
    
    // Age (young parents)
    if (age >= 25 && age <= 50) relevance += 0.20;
    
    // Education level
    if (educationLevel >= 4) relevance += 0.25;
    else if (educationLevel >= 2) relevance += 0.15;
    
    // Gender (mothers prioritize)
    if (gender === 'female') relevance += 0.15;
    
    // Literacy
    if (literacy > 0.7) relevance += 0.15;
    else if (literacy > 0.3) relevance += 0.08;
    
    // Income
    if (income > 20000) relevance += 0.15;
    else if (income < 5000) relevance += 0.20;
    
    // Occupation
    if (occupation === 'student' || occupation === 'teacher' || occupation === 'education') relevance += 0.40;
    
    // Policy awareness - educated know about education policy
    if (policyAwareness > 0.5) relevance += 0.15;
    
    // Income stability - unstable families can't afford school
    if (incomeStability < 0.3) relevance += 0.15;
    
    // Debt vulnerability - education is expensive
    if (debtVulnerability > 0.5) relevance += 0.15;
    
    relevance *= universalMultiplier;
  }
  
  // ========== AGRICULTURE DOMAIN ==========
  else if (domain === 'agriculture') {
    relevance += 0.05;
    
    // Occupation - PRIMARY
    if (occupation === 'agriculture' || occupation === 'farmer' || occupation === 'farming') relevance += 0.85;
    else if (occupation === 'rural business' || occupation === 'cattle rearing') relevance += 0.50;
    
    // Location
    if (urbanization === 'rural') relevance += 0.40;
    else if (urbanization === 'semi-urban') relevance += 0.20;
    else relevance += 0.08;
    
    // Household size
    if (householdSize >= 4) relevance += 0.15;
    
    // Climate vulnerability
    if (climateVulnerability > 0.6) relevance += 0.30;
    else if (climateVulnerability > 0.3) relevance += 0.15;
    
    // Income
    if (income < 5000) relevance += 0.25;
    else if (income < 15000) relevance += 0.15;
    
    // Literacy
    if (literacy > 0.6) relevance += 0.12;
    else relevance += 0.05;
    
    // Income stability - farmers have variable income
    if (incomeStability < 0.3) relevance += 0.25;
    
    // Debt vulnerability - farmers borrow for seeds
    if (debtVulnerability > 0.5) relevance += 0.20;
    
    // Risk tolerance - farmers conservative about crop changes
    if (riskTolerance < 0.3) relevance += 0.15;
    
    // Policy awareness - low in rural areas
    if (policyAwareness < 0.3) relevance -= 0.10; // Unaware = less relevant
    
    relevance *= universalMultiplier;
  }
  
  // ========== TAX DOMAIN ==========
  else if (domain === 'tax') {
    relevance += 0.03;
    
    // Income - PRIMARY FACTOR
    if (income > 25000) relevance += 0.75;
    else if (income > 15000) relevance += 0.55;
    else if (income > 8000) relevance += 0.35;
    else if (income > 5000) relevance += 0.15;
    else relevance += 0.05;
    
    // Employment type
    if (employment === 'formal') relevance += 0.35;
    else if (employment === 'informal') relevance += 0.08;
    
    // Education
    if (educationLevel >= 4) relevance += 0.15;
    
    // Occupation
    if (occupation === 'business' || occupation === 'entrepreneur' || occupation === 'self-employed') relevance += 0.40;
    
    // Savings rate - those with savings care about taxes
    if (savingsRate > 0.15) relevance += 0.20;
    
    // Age
    if (age >= 25 && age <= 60) relevance += 0.15;
    
    // Income stability - stable income = predictable taxes
    if (incomeStability > 0.6) relevance += 0.12;
    
    // Institutional trust - distrusting people care about how taxes used
    if (institutionalTrust < 0.4) relevance += 0.15;
    
    relevance *= universalMultiplier;
  }
  
  // ========== EMPLOYMENT DOMAIN ==========
  else if (domain === 'employment') {
    relevance += 0.05;
    
    // Employment status
    if (employment === 'formal' || employment === 'employed') relevance += 0.60;
    else if (employment === 'informal' || employment === 'self-employed') relevance += 0.50;
    else if (employment === 'unemployed') relevance += 0.70;
    
    // Age (working age)
    if (age >= 18 && age <= 65) relevance += 0.30;
    
    // Education
    if (educationLevel >= 3) relevance += 0.20;
    else relevance += 0.10;
    
    // Income stability - unstable = highly relevant
    if (incomeStability < 0.3) relevance += 0.30;
    else if (incomeStability < 0.6) relevance += 0.15;
    
    // Occupation
    if (occupation === 'student') relevance += 0.40;
    if (occupation === 'laborer' || occupation === 'construction') relevance += 0.45;
    
    // Debt vulnerability - jobless people in debt
    if (debtVulnerability > 0.5) relevance += 0.20;
    
    // Risk tolerance - risk-averse want job security
    if (riskTolerance < 0.3) relevance += 0.15;
    
    // Policy awareness - informed about job policies
    if (policyAwareness > 0.5) relevance += 0.12;
    
    relevance *= universalMultiplier;
  }
  
  // ========== HOUSING DOMAIN ==========
  else if (domain === 'housing') {
    relevance += 0.05;
    
    // Housing type
    if (housingType === 'rented' || housingType === 'rental') relevance += 0.60;
    else if (housingType === 'government') relevance += 0.55;
    else if (housingType === 'slum' || housingType === 'informal') relevance += 0.70;
    else if (housingType === 'owned' || housingType === 'own') relevance += 0.40;
    
    // Housing cost burden
    if (housingCost > 0.4) relevance += 0.35;
    else if (housingCost > 0.2) relevance += 0.20;
    
    // Income
    if (income < 5000) relevance += 0.35;
    else if (income < 15000) relevance += 0.25;
    else if (income > 25000) relevance += 0.15;
    
    // Age (family formation)
    if (age >= 25 && age <= 50) relevance += 0.25;
    
    // Household size
    if (householdSize >= 5) relevance += 0.25;
    else if (householdSize >= 3) relevance += 0.15;
    
    // Urbanization
    if (urbanization === 'urban') relevance += 0.20;
    
    // Wealth quintile - bottom 20% need housing support
    if (wealthQuintile > 0.25) relevance += 0.20;
    
    // Income stability - stable = buying, unstable = renting
    if (incomeStability < 0.3) relevance += 0.15;
    
    relevance *= universalMultiplier;
  }
  
  // ========== ENVIRONMENT DOMAIN ==========
  else if (domain === 'environment') {
    relevance += 0.04;
    
    // Pollution exposure
    if (pollutionExposure > 0.7) relevance += 0.50;
    else if (pollutionExposure > 0.4) relevance += 0.30;
    else relevance += 0.10;
    
    // Climate vulnerability
    if (climateVulnerability > 0.7) relevance += 0.45;
    else if (climateVulnerability > 0.4) relevance += 0.25;
    else relevance += 0.10;
    
    // Green space access
    if (greenSpaceAccess < 0.3) relevance += 0.25;
    else if (greenSpaceAccess < 0.6) relevance += 0.15;
    else relevance += 0.08;
    
    // Education
    if (educationLevel >= 4) relevance += 0.30;
    else if (educationLevel >= 2) relevance += 0.15;
    else relevance += 0.05;
    
    // Age (young people activist)
    if (age < 35) relevance += 0.20;
    else if (age < 50) relevance += 0.10;
    
    // Urbanization
    if (urbanization === 'urban') relevance += 0.20;
    
    // Disease risk
    if (diseaseRisk > 50) relevance += 0.20;
    
    // Policy awareness - educated know about environment
    if (policyAwareness > 0.5) relevance += 0.15;
    
    // Media consumption - informed care about environment
    if (mediaConsumption > 0.6) relevance += 0.12;
    
    relevance *= universalMultiplier;
  }
  
  // ========== INFRASTRUCTURE DOMAIN ==========
  else if (domain === 'infrastructure') {
    relevance += 0.05;
    
    // Transport usage
    if (transportMode !== 'walking' && transportMode !== 'home') relevance += 0.35;
    
    // Commute time
    if (commute > 45) relevance += 0.25;
    else if (commute > 20) relevance += 0.15;
    
    // Urbanization
    if (urbanization === 'urban') relevance += 0.30;
    else if (urbanization === 'semi-urban') relevance += 0.20;
    else relevance += 0.10;
    
    // Income
    if (income > 15000) relevance += 0.15;
    
    // Occupation
    if (occupation === 'business' || occupation === 'entrepreneur') relevance += 0.25;
    
    // Age
    if (age >= 25 && age <= 60) relevance += 0.15;
    
    // Income stability - infrastructure affects business
    if (incomeStability < 0.4) relevance += 0.15;
    
    // Risk tolerance - poor infrastructure = business risk
    if (riskTolerance < 0.3) relevance += 0.12;
    
    relevance *= universalMultiplier;
  }
  
  // ========== TECHNOLOGY DOMAIN ==========
  else if (domain === 'technology') {
    relevance += 0.03;
    
    // Digital literacy
    if (digitalLiteracy > 0.6) relevance += 0.50;
    else if (digitalLiteracy > 0.3) relevance += 0.30;
    else relevance += 0.05;
    
    // Internet connectivity
    if (internetConnectivity > 0.6) relevance += 0.35;
    else if (internetConnectivity > 0.3) relevance += 0.15;
    else relevance += 0.05;
    
    // Digital services access
    if (digitalServicesAccess > 0.5) relevance += 0.30;
    else if (digitalServicesAccess > 0.2) relevance += 0.15;
    
    // Age (digital natives)
    if (age < 35) relevance += 0.25;
    else if (age < 55) relevance += 0.15;
    else relevance += 0.05;
    
    // Employment
    if (employment === 'formal') relevance += 0.25;
    else if (employment === 'self-employed') relevance += 0.20;
    
    // Education
    if (educationLevel >= 4) relevance += 0.20;
    else if (educationLevel <= 2) relevance += 0.10;
    
    // Occupation
    if (occupation === 'student' || occupation === 'technology' || occupation === 'it') relevance += 0.40;
    
    // Policy awareness - tech-savvy follow tech policy
    if (policyAwareness > 0.5) relevance += 0.15;
    
    // Risk tolerance - tech adopters are risk-takers
    if (riskTolerance > 0.6) relevance += 0.12;
    
    relevance *= universalMultiplier;
  }
  
  // ========== SOCIAL DOMAIN ==========
  else if (domain === 'social') {
    relevance += 0.05;
    
    // Poverty status - PRIMARY
    if (povertStatus === 1) relevance += 0.60;
    else if (income < 5000) relevance += 0.50;
    else if (income < 15000) relevance += 0.30;
    
    // Wealth quintile - bottom 20% most relevant
    if (wealthQuintile > 0.25) relevance += 0.25;
    else if (wealthQuintile > 0.15) relevance += 0.15;
    
    // Caste
    if (casteGroup === 'sc' || casteGroup === 'st') relevance += 0.50;
    else if (casteGroup === 'obc') relevance += 0.35;
    else relevance += 0.15;
    
    // Caste consciousness
    if (castConsciousness > 0.7) relevance += 0.25;
    else if (castConsciousness > 0.3) relevance += 0.12;
    
    // Gender (women's policies)
    if (gender === 'female') relevance += 0.25;
    
    // Age (youth and senior policies)
    if (age < 25) relevance += 0.20;
    else if (age > 60) relevance += 0.25;
    
    // Household size
    if (householdSize >= 4) relevance += 0.20;
    
    // Religion (minority policies)
    if (religion !== 'hindu') relevance += 0.20;
    
    // Institutional trust - distrustful need social protection
    if (institutionalTrust < 0.4) relevance += 0.15;
    
    // Policy awareness - social policies often unknown
    if (policyAwareness < 0.3) relevance -= 0.10;
    
    // Income stability - unstable need social net
    if (incomeStability < 0.3) relevance += 0.20;
    
    relevance *= universalMultiplier;
  }
  
  // ========== SECURITY DOMAIN ==========
  else if (domain === 'security') {
    relevance += 0.05;
    
    // Gender (women care about safety)
    if (gender === 'female') relevance += 0.40;
    
    // Age (vulnerable age groups)
    if (age < 25 || age > 60) relevance += 0.30;
    
    // Urbanization
    if (urbanization === 'urban') relevance += 0.25;
    else if (urbanization === 'rural') relevance += 0.15;
    
    // Income (low income in unsafe areas)
    if (income < 5000 && urbanization === 'urban') relevance += 0.25;
    
    // Education
    if (educationLevel >= 3) relevance += 0.15;
    
    // Household size
    if (householdSize >= 4) relevance += 0.15;
    
    // Civic participation
    if (civicParticipation > 0.5) relevance += 0.15;
    
    // Criminal record - NEW CRITICAL FACTOR
    // Security policies highly relevant for people with record
    if (criminalRecord > 0.02) relevance += 0.35;
    else if (criminalRecord > 0.01) relevance += 0.20;
    
    // Media consumption - informed fear crime
    if (mediaConsumption > 0.6) relevance += 0.12;
    
    // Sex ratio imbalance - NEW FACTOR
    // High imbalance = women's safety concerns
    if (sexRatio > 0.3) relevance += 0.20;
    else if (sexRatio < 0.1) relevance += 0.15;
    
    relevance *= universalMultiplier;
  }
  
  // ========== GENERAL DOMAIN ==========
  else {
    relevance += 0.10;
    
    // Economic cost affects everyone
    if (costImpact > 0) {
      const costToIncomeRatio = costImpact / (income * 12);
      relevance += Math.min(0.40, costToIncomeRatio * 2);
    }
    
    // Policy awareness
    if (policyAwareness > 0.6) relevance += 0.15;
    else if (policyAwareness > 0.2) relevance += 0.08;
    
    // Civic engagement
    if (votingBehavior > 0.7) relevance += 0.15;
    if (mediaConsumption > 0.6) relevance += 0.12;
    
    // Income stability affects overall political attention
    if (incomeStability < 0.3) relevance += 0.15;
    
    relevance *= universalMultiplier;
  }
  
  // Cap relevance at 1.0
  return Math.min(1.0, relevance);
}

export { calculateRelevance };
