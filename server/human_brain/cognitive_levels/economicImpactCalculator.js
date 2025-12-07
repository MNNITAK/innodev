/**
 * ECONOMIC IMPACT CALCULATOR - MICRO LEVEL (TARGET GROUP BASED)
 * Uses policy's targetGroups to determine who is actually affected
 * Converts macro-level policy costs to micro-level personal impacts
 * 
 * Key insight: Policy parser specifies WHO is affected (targetGroups)
 * We match human against those groups to get precise affectedness
 */

/**
 * Calculate affectedness factor: How much does this policy's target groups match this human?
 * This determines: personalCost = macroCost × affectedness
 * 
 * Returns: 0.0-1.5
 *   0.0 = not targeted at all
 *   1.0 = directly targeted
 *   1.5 = heavily targeted (multiple matching criteria)
 * 
 * @param {Object} human - Human with all demographic/socio-economic data
 * @param {Object} policy - Parsed policy with targetGroups and domain
 * @returns {number} Affectedness factor (0.0-1.5)
 */
function computeAffectedness(human, policy) {
  let affectednessScore = 0.0;
  
  const targetGroups = policy.targetGroups || [];
  const tg = targetGroups.map(g => g.toLowerCase()); // Create lowercase version for matching
  const domain = policy.domain?.toLowerCase() || '';
  
  // ========== EXTRACT ALL HUMAN FACTORS ==========
  // Demographics
  const income = human.socioEconomic?.incomePerCapita || 1000;
  const age = human.demographics?.age || 35;
  const gender = human.demographics?.gender?.toLowerCase() || 'male';
  const urbanization = human.demographics?.urbanization?.toLowerCase() || '';
  const householdSize = human.demographics?.dependents || 0;
  const religion = human.demographics?.religion?.toLowerCase() || 'hindu';
  const casteGroup = human.demographics?.casteGroup?.toLowerCase() || 'general';
  const sexRatio = human.demographics?.sexRatio || 0.5;
  
  // Socio-Economic
  const povertStatus = human.socioEconomic?.povertyStatus || 0; // 1 = below poverty line
  const wealthQuintile = human.socioEconomic?.wealthQuintileQ1 || 0.15; // Q1=poorest
  const occupation = human.socioEconomic?.occupation?.toLowerCase() || '';
  const educationLevel = human.socioEconomic?.educationLevel || 1;
  const employment = human.socioEconomic?.employmentType?.toLowerCase() || 'informal';
  const literacy = human.socioEconomic?.literacy || 0;
  
  // Housing
  const housingType = human.housing?.housingType?.toLowerCase() || 'pucca';
  const housingCost = human.housing?.housingCostBurden || 0;
  
  // Mobility & Transport
  const commute = human.mobility?.commuteTime || 30;
  const transportMode = human.mobility?.transportationMode?.toLowerCase() || 'walking';
  const mobilityScale = human.mobility?.geographicMobility || 0;
  
  // Health
  const diseaseRisk = human.health?.diseaseRisk || 30;
  const healthcareAccess = human.health?.healthcareAccess || 0.5;
  
  // Financial
  const incomeStability = human.financial?.incomeStability || 0.5;
  const debtVulnerability = human.financial?.debtVulnerability || 0;
  const savingsRate = human.financial?.savingsRate || 0;
  
  // Behavioral & Civic
  const institutionalTrust = human.behavioral?.institutionalTrust || 50;
  const criminalRecord = human.civic?.criminalRecord || 0;
  
  // Environment
  const climateVulnerability = human.environment?.climateVulnerability || 0;
  
  // ========== 1. INCOME GROUP MATCHING ==========
  const incomeMatchScore = (() => {
    let score = 0;
    
    // BPL (Below Poverty Line) / Poor
    if (tg.includes('poor') || tg.includes('bpl') || tg.includes('low_income')) {
      if (povertStatus === 1) score += 0.8; // Exactly BPL
      else if (income < 3000) score += 0.75; // Very poor
      else if (income < 5000) score += 0.5; // Poor
    }
    
    // Lower Middle Class
    if (tg.includes('lower_middle') || tg.includes('lower_class')) {
      if (income >= 5000 && income < 10000) score += 0.7;
    }
    
    // Middle Class
    if (tg.includes('middle_class') || tg.includes('middle_income')) {
      if (income >= 10000 && income < 25000) score += 0.7;
    }
    
    // Upper Middle / Rich
    if (tg.includes('upper_middle') || tg.includes('rich') || tg.includes('high_income')) {
      if (income >= 25000) score += 0.7;
    }
    
    // Any income class mentioned
    if (tg.includes('all_income_groups')) {
      score += 0.4; // Everyone affected equally
    }
    
    return score;
  })();
  affectednessScore += incomeMatchScore;
  
  // ========== 2. GEOGRAPHY MATCHING ==========
  const geoMatchScore = (() => {
    let score = 0;
    
    if (tg.includes('urban') && urbanization === 'urban') score += 0.6;
    if (tg.includes('semi-urban') && urbanization === 'semi-urban') score += 0.6;
    if (tg.includes('rural') && urbanization === 'rural') score += 0.6;
    if (tg.includes('tier1_cities') && urbanization === 'urban') score += 0.5; // Major cities
    if (tg.includes('tier2_cities') && urbanization === 'semi-urban') score += 0.5;
    
    // All areas
    if (tg.includes('all_areas')) score += 0.3;
    
    // Commute-specific
    if (tg.includes('long_commute') && commute > 60) score += 0.4;
    if (tg.includes('medium_commute') && commute > 30 && commute <= 60) score += 0.4;
    
    return score;
  })();
  affectednessScore += geoMatchScore;
  
  // ========== 3. TRANSPORT DOMAIN SPECIFIC ==========
  if (domain === 'transport') {
    const transportMatchScore = (() => {
      let score = 0;
      
      // Public transport users
      if (tg.includes('public_transport_users') || tg.includes('bus_users')) {
        if (transportMode === 'bus' || transportMode === 'public bus') score += 0.8;
      }
      
      if (tg.includes('train_users') || tg.includes('rail_users')) {
        if (transportMode === 'train' || transportMode === 'railway') score += 0.8;
      }
      
      if (tg.includes('auto_users') || tg.includes('rikshaw_users')) {
        if (transportMode === 'auto' || transportMode === 'auto rickshaw') score += 0.7;
      }
      
      // Private vehicle owners
      if (tg.includes('car_owners') || tg.includes('private_vehicle_users')) {
        if (transportMode === 'car' || transportMode === 'private vehicle') score += 0.8;
      }
      
      if (tg.includes('motorcycle_owners') || tg.includes('bike_owners')) {
        if (transportMode === 'motorcycle' || transportMode === 'bike') score += 0.7;
      }
      
      // Walking/cycle users (least affected by fuel price)
      if (tg.includes('walking_commuters')) {
        if (transportMode === 'walking') score += 0.5;
      }
      
      // Daily commuters
      if (tg.includes('commuters') && commute > 30) score += 0.5;
      
      // All transport users
      if (tg.includes('all_transport_users')) score += 0.3;
      
      return score;
    })();
    affectednessScore += transportMatchScore;
  }
  
  // ========== 4. HOUSING DOMAIN SPECIFIC ==========
  if (domain === 'housing') {
    const housingMatchScore = (() => {
      let score = 0;
      
      // Homeowners
      if (tg.includes('homeowners') || tg.includes('property_owners')) {
        if (housingType === 'owned' || housingType === 'own') score += 0.7;
      }
      
      // Renters (most affected by rent increases)
      if (tg.includes('renters') || tg.includes('tenants') || tg.includes('renting_population')) {
        if (housingType === 'rented' || housingType === 'rental') score += 0.85;
      }
      
      // Slum dwellers / informal settlement
      if (tg.includes('slum_dwellers') || tg.includes('informal_settlement') || tg.includes('urban_poor')) {
        if (housingType === 'slum' || housingType === 'informal') score += 0.9; // Extremely vulnerable
      }
      
      // Government housing beneficiaries
      if (tg.includes('govt_housing_beneficiaries') || tg.includes('housing_scheme_recipients')) {
        if (housingType === 'government') score += 0.7;
      }
      
      // High housing cost burden
      if (tg.includes('high_housing_burden')) {
        if (housingCost > 0.4) score += 0.6;
      }
      
      // First-time homebuyers
      if (tg.includes('first_time_buyers') && age >= 25 && age <= 40) score += 0.5;
      
      // Large families needing housing
      if (tg.includes('large_families') && householdSize >= 4) score += 0.5;
      
      // All housing consumers
      if (tg.includes('all_housing_consumers')) score += 0.2;
      
      return score;
    })();
    affectednessScore += housingMatchScore;
  }
  
  // ========== 5. HEALTH DOMAIN SPECIFIC ==========
  if (domain === 'health') {
    const healthMatchScore = (() => {
      let score = 0;
      
      // Elderly
      if (tg.includes('elderly') || tg.includes('seniors') || tg.includes('age_60_plus')) {
        if (age >= 60) score += 0.75;
        else if (age >= 50) score += 0.4;
      }
      
      // Children / pediatric
      if (tg.includes('children') || tg.includes('pediatric')) {
        if (age < 18 || householdSize > 0) score += 0.6;
      }
      
      // Pregnant women
      if (tg.includes('pregnant_women') || tg.includes('maternal')) {
        if (gender === 'female' && age >= 18 && age <= 45) score += 0.6;
      }
      
      // Chronic disease patients
      if (tg.includes('chronic_patients') || tg.includes('disease_prone')) {
        if (diseaseRisk > 60) score += 0.7;
      }
      
      // Low healthcare access
      if (tg.includes('low_healthcare_access') || tg.includes('underserved')) {
        if (healthcareAccess < 0.3) score += 0.7;
      }
      
      // Low income health seekers
      if (tg.includes('low_income_health') && income < 5000) score += 0.6;
      
      // All citizens / universal coverage
      if (tg.includes('all_citizens') || tg.includes('universal_coverage')) score += 0.2;
      
      return score;
    })();
    affectednessScore += healthMatchScore;
  }
  
  // ========== 6. EDUCATION DOMAIN SPECIFIC ==========
  if (domain === 'education') {
    const educationMatchScore = (() => {
      let score = 0;
      
      // Students
      if (tg.includes('students') && age < 25) score += 0.85;
      
      // School-age children
      if (tg.includes('school_children') && (age < 18 || householdSize > 0)) score += 0.7;
      
      // Higher education seekers
      if (tg.includes('higher_education_students') && age >= 18 && age <= 25) score += 0.75;
      
      // Low-income education
      if (tg.includes('low_income_students') && income < 5000) score += 0.8;
      
      // First-generation learners
      if (tg.includes('first_generation') && literacy < 0.3) score += 0.6;
      
      // Parents with children
      if (tg.includes('parents') && householdSize > 0) score += 0.6;
      
      // Teachers
      if (tg.includes('teachers') && occupation === 'teacher') score += 0.8;
      
      // All education consumers
      if (tg.includes('all_students')) score += 0.2;
      
      return score;
    })();
    affectednessScore += educationMatchScore;
  }
  
  // ========== 7. AGRICULTURE DOMAIN SPECIFIC ==========
  if (domain === 'agriculture') {
    const agriMatchScore = (() => {
      let score = 0;
      
      // Farmers (directly targeted)
      if (tg.includes('farmers') || tg.includes('agriculture_workers')) {
        if (occupation === 'agriculture' || occupation === 'farmer' || occupation === 'farming') {
          score += 1.0; // Directly affected
        }
      }
      
      // Rural population
      if (tg.includes('rural_population') && urbanization === 'rural') score += 0.6;
      
      // Agricultural workers / laborers
      if (tg.includes('agricultural_laborers') && occupation === 'laborer') score += 0.7;
      
      // Livestock rearers
      if (tg.includes('livestock_owners') && (occupation === 'cattle rearing' || occupation === 'pastoral')) {
        score += 0.75;
      }
      
      // Climate-vulnerable farmers
      if (tg.includes('climate_vulnerable_farmers') && climateVulnerability > 0.6 && urbanization === 'rural') {
        score += 0.8;
      }
      
      // Tenant farmers / landless
      if (tg.includes('landless_farmers') && povertStatus === 1 && urbanization === 'rural') score += 0.7;
      
      return score;
    })();
    affectednessScore += agriMatchScore;
  }
  
  // ========== 8. EMPLOYMENT DOMAIN SPECIFIC ==========
  if (domain === 'employment') {
    const employmentMatchScore = (() => {
      let score = 0;
      
      // Unemployed
      if (tg.includes('unemployed') && employment === 'unemployed') score += 0.9;
      
      // Informal workers
      if (tg.includes('informal_workers') && employment === 'informal') score += 0.8;
      
      // Formal workers
      if (tg.includes('formal_workers') && employment === 'formal') score += 0.5;
      
      // Self-employed
      if (tg.includes('self_employed') && employment === 'self-employed') score += 0.7;
      
      // Labor class / unorganized sector
      if (tg.includes('laborers') && (occupation === 'laborer' || occupation === 'construction')) score += 0.8;
      
      // Youth job seekers
      if (tg.includes('youth_employment') && age < 30) score += 0.6;
      
      // Women workforce
      if (tg.includes('women_employment') && gender === 'female') score += 0.6;
      
      // Marginalized workers
      if (tg.includes('marginalized_workers')) {
        if (casteGroup === 'sc' || casteGroup === 'st' || income < 5000) score += 0.65;
      }
      
      return score;
    })();
    affectednessScore += employmentMatchScore;
  }
  
  // ========== 9. TAX DOMAIN SPECIFIC ==========
  if (domain === 'tax') {
    const taxMatchScore = (() => {
      let score = 0;
      
      // High earners
      if (tg.includes('high_earners') && income > 25000) score += 0.8;
      
      // Middle income
      if (tg.includes('middle_income') && income >= 10000 && income < 25000) score += 0.6;
      
      // Business owners / entrepreneurs
      if (tg.includes('business_owners') || tg.includes('entrepreneurs')) {
        if (occupation === 'business' || occupation === 'entrepreneur') score += 0.85;
      }
      
      // Salaried workers (formal tax payers)
      if (tg.includes('salaried_workers') && employment === 'formal') score += 0.7;
      
      // Property owners (wealth tax)
      if (tg.includes('property_owners') && housingType !== 'informal') score += 0.5;
      
      // Savers (wealth/savings tax)
      if (tg.includes('savers') && savingsRate > 0.1) score += 0.6;
      
      // All tax payers
      if (tg.includes('taxpayers') && income > 5000) score += 0.4;
      
      return score;
    })();
    affectednessScore += taxMatchScore;
  }
  
  // ========== 10. SOCIAL DOMAIN SPECIFIC ==========
  if (domain === 'social') {
    const socialMatchScore = (() => {
      let score = 0;
      
      // SC/ST (scheduled castes/tribes)
      if (tg.includes('scheduled_caste') || tg.includes('sc') || tg.includes('scheduled_tribe') || tg.includes('st')) {
        if (casteGroup === 'sc' || casteGroup === 'st') score += 0.85;
      }
      
      // OBC (other backward classes)
      if (tg.includes('obc')) {
        if (casteGroup === 'obc') score += 0.75;
      }
      
      // Minorities
      if (tg.includes('minorities') || tg.includes('minority_religions')) {
        if (religion !== 'hindu') score += 0.7;
      }
      
      // Women
      if (tg.includes('women') && gender === 'female') score += 0.75;
      
      // Women entrepreneurs
      if (tg.includes('women_entrepreneurs') && gender === 'female' && occupation === 'entrepreneur') score += 0.85;
      
      // LGBTQ+
      if (tg.includes('lgbtq') || tg.includes('gender_minorities')) score += 0.7;
      
      // Youth
      if (tg.includes('youth') && age < 30) score += 0.6;
      
      // Elderly / seniors
      if (tg.includes('elderly') || tg.includes('seniors') && age >= 60) score += 0.8;
      
      // Persons with disability
      if (tg.includes('pwd') || tg.includes('disabled')) score += 0.75;
      
      // Widows / widowers
      if (tg.includes('widows')) score += 0.6;
      
      // Single mothers
      if (tg.includes('single_mothers') && gender === 'female' && householdSize > 0) score += 0.8;
      
      // Vulnerable groups (broad)
      if (tg.includes('vulnerable_populations')) {
        if (povertStatus === 1 || income < 5000) score += 0.7;
      }
      
      return score;
    })();
    affectednessScore += socialMatchScore;
  }
  
  // ========== 11. SECURITY DOMAIN SPECIFIC ==========
  if (domain === 'security') {
    const securityMatchScore = (() => {
      let score = 0;
      
      // Women (safety)
      if (tg.includes('women_safety') && gender === 'female') score += 0.8;
      
      // Children
      if (tg.includes('child_safety') && age < 18) score += 0.75;
      
      // Elderly (vulnerable to crime)
      if (tg.includes('elderly_safety') && age >= 60) score += 0.7;
      
      // Law enforcement / criminal justice
      if (tg.includes('law_enforcement') && (criminalRecord > 0 || occupation === 'security')) score += 0.7;
      
      // Urban residents
      if (tg.includes('urban_security') && urbanization === 'urban') score += 0.6;
      
      // All citizens
      if (tg.includes('all_citizens_safety')) score += 0.3;
      
      return score;
    })();
    affectednessScore += securityMatchScore;
  }
  
  // ========== 12. ENVIRONMENT DOMAIN SPECIFIC ==========
  if (domain === 'environment') {
    const envMatchScore = (() => {
      let score = 0;
      
      // Farmers (climate affected)
      if (tg.includes('climate_affected') && urbanization === 'rural') score += 0.7;
      
      // Urban residents (pollution affected)
      if (tg.includes('pollution_affected') && urbanization === 'urban') score += 0.6;
      
      // Coastal / flood-prone
      if (tg.includes('climate_vulnerable') && climateVulnerability > 0.6) score += 0.75;
      
      // All population
      if (tg.includes('all_citizens')) score += 0.2;
      
      return score;
    })();
    affectednessScore += envMatchScore;
  }
  
  // ========== 13. TECHNOLOGY DOMAIN SPECIFIC ==========
  if (domain === 'technology') {
    const techMatchScore = (() => {
      let score = 0;
      
      // Digital workers / IT professionals
      if (tg.includes('digital_workers') && (occupation === 'technology' || occupation === 'it')) score += 0.8;
      
      // Students / youth (tech savvy)
      if (tg.includes('digital_natives') && age < 30) score += 0.6;
      
      // Low digital literacy (negatively affected)
      if (tg.includes('digital_divide_affected') && (occupation !== 'technology' && age > 50)) score += 0.5;
      
      // All citizens
      if (tg.includes('all_citizens')) score += 0.2;
      
      return score;
    })();
    affectednessScore += techMatchScore;
  }
  
  // ========== INFRASTRUCTURE DOMAIN SPECIFIC ==========
  if (domain === 'infrastructure') {
    const infraMatchScore = (() => {
      let score = 0;
      
      // Business owners (productivity affected)
      if (tg.includes('businesses') && (occupation === 'business' || occupation === 'entrepreneur')) score += 0.7;
      
      // Transport dependent
      if (tg.includes('transport_users') && commute > 30) score += 0.6;
      
      // Rural population (lack of infrastructure)
      if (tg.includes('rural_population') && urbanization === 'rural') score += 0.6;
      
      // All citizens
      if (tg.includes('all_citizens')) score += 0.2;
      
      return score;
    })();
    affectednessScore += infraMatchScore;
  }
  
  // ========== FINANCIAL VULNERABILITY BONUS ==========
  // Even if not directly targeted, very vulnerable people are hit harder
  const vulnerabilityBonus = (() => {
    let bonus = 0;
    
    // Already poor get hit harder
    if (povertStatus === 1 && incomeStability < 0.3) bonus += 0.25;
    
    // High debt load
    if (debtVulnerability > 0.6) bonus += 0.15;
    
    // No safety net (no savings)
    if (savingsRate < 0.05) bonus += 0.1;
    
    // Large family with low income
    if (householdSize >= 4 && income < 5000) bonus += 0.15;
    
    return bonus;
  })();
  affectednessScore += vulnerabilityBonus;
  
  // ========== RETURN FINAL AFFECTEDNESS ==========
  // Clamp between 0.0 and 1.5
  // 0.0 = not affected at all
  // 1.0 = directly targeted
  // 1.5 = heavily targeted (multiple matching criteria + vulnerable)
  return Math.min(1.5, Math.max(0.0, affectednessScore));
}

/**
 * Calculate economic impact for an individual
 * @param {Object} human - Human with all data
 * @param {Object} policy - Parsed policy with targetGroups, costs, benefits
 * @returns {Object} Economic impact details
 */
function calculateEconomicImpact(human, policy) {
  // Extract key factors
  const income = human.socioEconomic?.incomePerCapita || 1000;
  const monthlyIncome = income / 12;
  const incomeStability = human.financial?.incomeStability || 0.5;
  const debtVulnerability = human.financial?.debtVulnerability || 0;
  const savingsRate = human.financial?.savingsRate || 0;
  const institutionalTrust = human.behavioral?.institutionalTrust || 50;
  const povertStatus = human.socioEconomic?.povertyStatus || 0;
  const householdSize = human.demographics?.dependents || 0;
  
  // ========== GET AFFECTEDNESS FROM TARGET GROUPS ==========
  const affectedness = computeAffectedness(human, policy);
  
  // ========== SCALE MACRO COSTS TO MICRO LEVEL ==========
  // Policy parser gives base cost (e.g., -₹1200 per person)
  // Multiply by affectedness to get personal cost
  const macroCost = policy.impacts?.economicCost || 0;
  const macroBenefit = policy.impacts?.economicBenefit || 0;
  
  // Personal costs based on targeting match
  const personalCost = macroCost * affectedness;
  const personalBenefit = macroBenefit * affectedness;
  
  // Direct net impact
  const directNetImpact = personalBenefit - personalCost;
  
  // ========== FUTURE BENEFITS (Discounted) ==========
  const futurePromise = policy.promises?.futureEconomicBenefit || 0;
  const trustLevel = institutionalTrust / 100;
  const discountRate = 0.3 + (0.5 * (1 - trustLevel)); // Less trust = steeper discount
  const discountedFuture = futurePromise * affectedness * discountRate;
  
  // ========== HOUSEHOLD BURDEN FACTOR ==========
  // Larger households spread cost over more people, but also struggle more
  const householdMultiplier = 1.0 + (householdSize * 0.12);
  
  // ========== TOTAL IMPACT ==========
  const totalNetImpact = (directNetImpact + discountedFuture) / householdMultiplier;
  
  // ========== INCOME-BASED SENSITIVITY ==========
  // Same cost hurts poor much more than rich
  const monthlyImpact = totalNetImpact / 12;
  const impactRatio = monthlyImpact / monthlyIncome;
  
  const sensitivityMultiplier = income < 5000 ? 4.0 : 
                                income < 15000 ? 2.5 : 
                                1.0;
  
  const economicScore = Math.tanh(impactRatio * sensitivityMultiplier);
  
  // ========== AFFORDABILITY ASSESSMENT ==========
  const maxAffordableCost = monthlyIncome * 0.2;
  
  let affordabilityStatus = 'sustainable';
  if (monthlyImpact < -maxAffordableCost) {
    affordabilityStatus = 'unsustainable';
  } else if (monthlyImpact < -maxAffordableCost * 0.5) {
    affordabilityStatus = 'strained';
  } else if (monthlyImpact > maxAffordableCost) {
    affordabilityStatus = 'major_benefit';
  }
  
  // ========== FINANCIAL VULNERABILITY ADJUSTMENT ==========
  let vulnerabilityFactor = 1.0;
  
  if (debtVulnerability > 0.6) vulnerabilityFactor *= 1.4;
  if (incomeStability < 0.3) vulnerabilityFactor *= 1.3;
  if (povertStatus === 1) vulnerabilityFactor *= 1.2;
  if (savingsRate < 0.05) vulnerabilityFactor *= 1.15;
  
  const adjustedEconomicScore = Math.max(-1, Math.min(1, economicScore * vulnerabilityFactor));
  
  // ========== RETURN DETAILED BREAKDOWN ==========
  return {
    // Main output
    economicScore: adjustedEconomicScore, // -1 to +1 (negative = cost, positive = benefit)
    
    // Targeting & Affectedness
    affectedness: affectedness, // 0-1.5 (how much targeted)
    isDirectlyTargeted: affectedness > 0.5,
    targetMatchDetails: policy.targetGroups, // Original target groups
    
    // Costs & Benefits (Personal Level)
    personalCost: personalCost, // Annual personal cost in ₹
    personalBenefit: personalBenefit, // Annual personal benefit in ₹
    directNetImpact: directNetImpact, // Direct annual impact
    discountedFutureImpact: discountedFuture, // Future benefits (discounted)
    totalNetImpact: totalNetImpact, // Total annual impact
    monthlyImpact: monthlyImpact, // Monthly impact in ₹
    
    // Affordability metrics
    monthlyIncomeRatio: monthlyIncome,
    affordability: monthlyImpact > 0 ? monthlyIncome / Math.max(1, monthlyImpact) : Infinity,
    affordabilityStatus: affordabilityStatus,
    canAfford: affordabilityStatus !== 'unsustainable',
    
    // Impact ratios
    monthlyImpactRatio: (monthlyImpact / monthlyIncome) * 100, // % of monthly income
    yearlyImpactRatio: (totalNetImpact / income) * 100, // % of yearly income
    
    // Vulnerability context
    vulnerabilityFactor: vulnerabilityFactor,
    trustLevel: trustLevel,
    sensitivityMultiplier: sensitivityMultiplier,
    householdBurdenMultiplier: householdMultiplier,
    
    // Detailed sensitivity
    sensitivity: {
      toDirectCost: personalCost > 0,
      toBenefit: personalBenefit > 0,
      toFuturePromise: discountedFuture > 0,
      dependsOnTrust: institutionalTrust,
      isVulnerable: vulnerabilityFactor > 1.0,
      details: {
        inDebt: debtVulnerability > 0.6,
        unstableIncome: incomeStability < 0.3,
        poorOrBelowLine: povertStatus === 1,
        noSavings: savingsRate < 0.05,
        largeHousehold: householdSize >= 4,
      }
    }
  };
}

export { calculateEconomicImpact, computeAffectedness };
