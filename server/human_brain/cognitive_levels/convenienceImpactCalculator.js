/**
 * CONVENIENCE IMPACT CALCULATOR - COMPREHENSIVE
 * 
 * Analyzes how a policy affects a person's daily life convenience,
 * time usage, accessibility, and quality of life factors.
 * 
 * Uses ALL 50+ human factors to determine:
 * 1. Time impact (commute, waiting, service access)
 * 2. Accessibility changes (physical, digital, geographic)
 * 3. Daily routine disruption or improvement
 * 4. Service availability and quality
 * 5. Lifestyle and comfort changes
 * 
 * Key insight: Convenience is subjective and depends on:
 * - Current time constraints (employed vs unemployed)
 * - Mobility patterns and dependencies
 * - Digital access and literacy
 * - Geographic location and infrastructure
 * - Health and physical limitations
 * - Family responsibilities
 */

/**
 * Calculate comprehensive convenience impact of a policy on a person
 * @param {Object} human - Human with all demographic/socio-economic data
 * @param {Object} policy - Parsed policy with domain, targetGroups, and impacts
 * @returns {number} Convenience impact score (-1 to +1)
 */
function calculateConvenienceImpact(human, policy) {
  let totalScore = 0;
  let factorCount = 0;
  
  const domain = policy.domain?.toLowerCase() || 'general';
  const targetGroups = policy.targetGroups || [];
  const tg = targetGroups.map(g => g.toLowerCase());
  
  // Policy impact values
  const timeChange = policy.impacts?.timeChange || 0; // Minutes per day
  const healthImpact = policy.impacts?.healthImpact || 0;
  const environmentImpact = policy.impacts?.environmentImpact || 0;
  
  // ========== EXTRACT ALL HUMAN FACTORS ==========
  
  // === 1. DEMOGRAPHICS ===
  const age = human.demographics?.age || 35;
  const sex = human.demographics?.sex?.toLowerCase() || 'male';
  const householdSize = human.demographics?.householdSize || 4;
  const urbanization = human.demographics?.urbanization?.toLowerCase() || 'rural';
  const religion = human.demographics?.religion?.toLowerCase() || 'hindu';
  const caste = human.demographics?.caste?.toLowerCase() || 'general';
  
  // === 2. SOCIO-ECONOMIC ===
  const income = human.socioEconomic?.incomePerCapita || 1000;
  const povertyStatus = human.socioEconomic?.povertyStatus || 0;
  const literacy = human.socioEconomic?.literacy || 1;
  const educationLevel = human.socioEconomic?.educationLevel || 1;
  const occupation = human.socioEconomic?.occupation?.toLowerCase() || 'informal';
  const employmentType = human.socioEconomic?.employmentType?.toLowerCase() || 'informal';
  const wealthQuintile = human.socioEconomic?.wealthQuintile?.toLowerCase() || 'q3';
  
  // === 3. BEHAVIORAL ===
  const casteConsciousness = human.behavioral?.casteConsciousness || 3;
  const riskTolerance = human.behavioral?.riskTolerance || 3;
  const institutionalTrust = human.behavioral?.institutionalTrust || 50;
  const changeAdaptability = human.behavioral?.changeAdaptability || 3;
  
  // === 4. HEALTH ===
  const healthcareAccess = human.health?.healthcareAccess || 50;
  const healthLiteracy = human.health?.healthLiteracy || 3;
  const bmiCategory = human.health?.nutritionalStatus?.category?.toLowerCase() || 'normal';
  const diseaseRisk = human.health?.diseaseRisk || 30;
  
  // === 5. ECONOMIC STABILITY ===
  const incomeStability = human.economicStability?.incomeStability || 3;
  const debtVulnerability = human.economicStability?.debtVulnerability || 30;
  const savingsRate = human.economicStability?.savingsRate || 5;
  
  // === 6. HOUSING ===
  const housingType = human.housing?.housingType?.toLowerCase() || 'owned';
  const housingCostBurden = human.housing?.housingCostBurden || 20;
  
  // === 7. MOBILITY ===
  const commuteTime = human.mobility?.commuteTime || 30;
  const transportMode = human.mobility?.transportationMode?.toLowerCase() || 'bus';
  const geographicMobility = human.mobility?.geographicMobility || 3;
  
  // === 9. POLITICAL/CIVIC ===
  const votingBehavior = human.political?.votingBehavior?.toLowerCase() || 'regular';
  const civicParticipation = human.political?.civicParticipation || 10;
  const mediaConsumption = human.political?.mediaConsumption?.toLowerCase() || 'both';
  
  // === 10. DIGITAL ===
  const internetConnectivity = human.digital?.internetConnectivity?.toLowerCase() || 'mobile only';
  const digitalLiteracy = human.digital?.digitalLiteracy || 2;
  const digitalServicesAccess = human.digital?.digitalServicesAccess || 30;
  
  // === 11. ENVIRONMENTAL ===
  const pollutionExposure = human.environmental?.pollutionExposure || 50;
  const climateVulnerability = human.environmental?.climateVulnerability || 3;
  const greenSpaceAccess = human.environmental?.greenSpaceAccess || 20;
  
  // === 12. LEGAL ===
  const citizenshipStatus = human.legal?.citizenshipStatus?.toLowerCase() || 'citizen';
  const criminalRecord = human.legal?.criminalRecord || false;
  
  // === 13. INFORMATION ===
  const policyAwareness = human.information?.policyAwareness || 2;
  
  
  // ============================================================
  // SECTION 1: TIME VALUE CALCULATION
  // How much does this person value their time?
  // ============================================================
  
  let timeValueMultiplier = 1.0;
  
  // Employment status affects time value
  if (employmentType === 'formal') {
    timeValueMultiplier += 0.5; // Formal workers have structured schedules
  } else if (employmentType === 'self-employed') {
    timeValueMultiplier += 0.4; // Time is money for self-employed
  } else if (employmentType === 'informal') {
    timeValueMultiplier += 0.2; // Still value time but more flexible
  } else if (employmentType === 'unemployed') {
    timeValueMultiplier -= 0.3; // Have more free time
  }
  
  // Income affects time value (opportunity cost)
  if (income > 25000) {
    timeValueMultiplier += 0.4; // High earners value time more
  } else if (income > 15000) {
    timeValueMultiplier += 0.2;
  } else if (income < 3000) {
    timeValueMultiplier -= 0.2; // Low earners may have more time than money
  }
  
  // Age affects time perception
  if (age > 60) {
    timeValueMultiplier += 0.3; // Elderly value time for health reasons
  } else if (age >= 25 && age <= 45) {
    timeValueMultiplier += 0.2; // Peak working years
  } else if (age < 25) {
    timeValueMultiplier -= 0.1; // Youth have more time flexibility
  }
  
  // Large families have more time constraints
  if (householdSize >= 5) {
    timeValueMultiplier += 0.25;
  } else if (householdSize >= 4) {
    timeValueMultiplier += 0.1;
  }
  
  // Women often have more household responsibilities (Indian context)
  if (sex === 'female' && householdSize >= 3) {
    timeValueMultiplier += 0.2;
  }
  
  // Current commute time affects sensitivity to time changes
  if (commuteTime > 60) {
    timeValueMultiplier += 0.3; // Long commuters are very time-sensitive
  } else if (commuteTime > 45) {
    timeValueMultiplier += 0.15;
  }
  
  // Health issues make time more precious
  if (diseaseRisk > 50 || age > 60) {
    timeValueMultiplier += 0.2;
  }
  
  timeValueMultiplier = Math.max(0.3, Math.min(2.5, timeValueMultiplier));
  
  
  // ============================================================
  // SECTION 2: DIRECT TIME IMPACT
  // ============================================================
  
  let timeScore = 0;
  
  if (timeChange !== 0) {
    // Base time impact: 60 minutes = ±0.5 base score
    let baseTimeScore = (timeChange / 120);
    
    // Apply time value multiplier
    timeScore = baseTimeScore * timeValueMultiplier;
    
    // Domain-specific time adjustments
    if (domain === 'transport') {
      // Transport time changes are felt more directly
      if (transportMode === 'bus' || transportMode === 'train') {
        timeScore *= 1.3; // Public transport users more affected
      }
      if (commuteTime > 45) {
        timeScore *= 1.2; // Long commuters feel changes more
      }
    }
    
    if (domain === 'health') {
      // Healthcare wait times
      if (healthcareAccess < 50) {
        timeScore *= 1.2; // Those with poor access value time improvements more
      }
      if (diseaseRisk > 50) {
        timeScore *= 1.3; // Frequent healthcare users
      }
    }
    
    if (domain === 'infrastructure') {
      // Infrastructure improvements affect daily routines
      if (urbanization === 'rural') {
        timeScore *= 1.2; // Rural areas benefit more from infrastructure
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, timeScore)) * 0.35; // 35% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 3: TRANSPORT & MOBILITY CONVENIENCE
  // ============================================================
  
  let mobilityScore = 0;
  
  if (domain === 'transport' || domain === 'infrastructure') {
    // Current transport mode determines impact
    
    // Bus users
    if (transportMode === 'bus') {
      if (tg.includes('bus_users') || tg.includes('public_transport')) {
        mobilityScore += 0.5;
      }
      // Bus fare changes
      if (policy.impacts?.economicCost > 0) {
        mobilityScore -= 0.3; // Fare increase = less convenience
      }
      // Bus frequency/route improvements
      if (tg.includes('frequency') || tg.includes('new_routes')) {
        mobilityScore += 0.4;
      }
    }
    
    // Train users
    if (transportMode === 'train') {
      if (tg.includes('train') || tg.includes('railway') || tg.includes('metro')) {
        mobilityScore += 0.5;
      }
    }
    
    // Car owners
    if (transportMode === 'car') {
      if (tg.includes('road') || tg.includes('highway') || tg.includes('parking')) {
        mobilityScore += 0.4;
      }
      // Fuel price changes
      if (tg.includes('fuel') || tg.includes('petrol')) {
        if (policy.impacts?.economicCost > 0) {
          mobilityScore -= 0.3;
        } else {
          mobilityScore += 0.3;
        }
      }
    }
    
    // Bike users
    if (transportMode === 'bike') {
      if (tg.includes('bike') || tg.includes('two_wheeler') || tg.includes('cycle_lane')) {
        mobilityScore += 0.4;
      }
    }
    
    // Walkers
    if (transportMode === 'walk') {
      if (tg.includes('pedestrian') || tg.includes('footpath') || tg.includes('walkway')) {
        mobilityScore += 0.5;
      }
    }
    
    // Geographic mobility affects adaptability to transport changes
    if (geographicMobility >= 4) {
      // Highly mobile people adapt better
      if (mobilityScore < 0) {
        mobilityScore *= 0.8; // Less negative impact
      }
    } else if (geographicMobility <= 2) {
      // Low mobility people are more dependent on existing transport
      if (mobilityScore < 0) {
        mobilityScore *= 1.2; // More negative impact
      }
    }
    
    // Long commute time means higher sensitivity
    if (commuteTime > 60) {
      mobilityScore *= 1.3;
    }
    
    totalScore += Math.max(-1, Math.min(1, mobilityScore)) * 0.2; // 20% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 4: DIGITAL & SERVICE ACCESSIBILITY
  // ============================================================
  
  let digitalScore = 0;
  
  if (domain === 'technology' || tg.some(g => ['digital', 'online', 'e-governance', 'app', 'internet'].includes(g))) {
    
    // Internet connectivity determines base accessibility
    if (internetConnectivity === 'broadband') {
      digitalScore += 0.5; // Can fully benefit from digital services
    } else if (internetConnectivity === 'mobile only') {
      digitalScore += 0.3; // Partial benefit
    } else if (internetConnectivity === 'none') {
      // No internet = digital policies may exclude them
      if (tg.includes('mandatory') || tg.includes('only_online')) {
        digitalScore -= 0.6; // Inconvenience from being excluded
      } else {
        digitalScore -= 0.2; // Still some inconvenience
      }
    }
    
    // Digital literacy affects ability to use services
    if (digitalLiteracy >= 4) {
      digitalScore += 0.3;
    } else if (digitalLiteracy <= 2) {
      digitalScore -= 0.2; // Struggle with digital interfaces
    }
    
    // Current digital services access
    if (digitalServicesAccess > 60) {
      digitalScore += 0.2; // Already comfortable with digital
    } else if (digitalServicesAccess < 30) {
      digitalScore -= 0.15; // Not used to digital services
    }
    
    // Age affects digital adaptability
    if (age > 55) {
      digitalScore *= 0.7; // Elderly may struggle with digital
    } else if (age < 35) {
      digitalScore *= 1.2; // Youth adapt easily
    }
    
    // Education affects digital learning
    if (educationLevel >= 3) {
      digitalScore += 0.15;
    } else if (educationLevel <= 1) {
      digitalScore -= 0.15;
    }
    
    // Urban-rural divide in digital access
    if (urbanization === 'rural' && internetConnectivity !== 'broadband') {
      digitalScore -= 0.2; // Rural digital divide
    }
    
    totalScore += Math.max(-1, Math.min(1, digitalScore)) * 0.15; // 15% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 5: HEALTHCARE ACCESSIBILITY
  // ============================================================
  
  let healthcareScore = 0;
  
  if (domain === 'health') {
    // Current healthcare access determines baseline
    if (healthcareAccess < 40) {
      // Poor access = high sensitivity to health policy changes
      if (policy.impacts?.economicBenefit > 0 || tg.includes('free_healthcare')) {
        healthcareScore += 0.6; // Major convenience improvement
      }
      if (tg.includes('new_hospital') || tg.includes('health_center')) {
        healthcareScore += 0.5;
      }
    } else if (healthcareAccess > 70) {
      // Good access = less dramatic change
      healthcareScore += 0.2;
    }
    
    // Disease risk affects need for healthcare access
    if (diseaseRisk > 60) {
      healthcareScore *= 1.4; // Frequent users benefit more
    } else if (diseaseRisk > 40) {
      healthcareScore *= 1.2;
    }
    
    // Age affects healthcare needs
    if (age > 60) {
      healthcareScore *= 1.3; // Elderly need more healthcare
    } else if (age < 30 && diseaseRisk < 30) {
      healthcareScore *= 0.8; // Young healthy people less affected
    }
    
    // Health literacy affects ability to navigate system
    if (healthLiteracy >= 4) {
      healthcareScore += 0.15; // Can better utilize services
    } else if (healthLiteracy <= 2) {
      healthcareScore -= 0.1; // May struggle with complex systems
    }
    
    // Women with households may need more healthcare (pregnancy, childcare)
    if (sex === 'female' && age >= 20 && age <= 45 && householdSize >= 3) {
      healthcareScore *= 1.2;
    }
    
    // Rural areas often have poor healthcare
    if (urbanization === 'rural') {
      if (tg.includes('rural_health') || tg.includes('mobile_clinic')) {
        healthcareScore += 0.4;
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, healthcareScore)) * 0.1; // 10% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 6: HOUSING & LIVING CONVENIENCE
  // ============================================================
  
  let housingScore = 0;
  
  if (domain === 'housing' || domain === 'infrastructure') {
    // Housing type affects policy impact
    if (housingType === 'rented') {
      if (tg.includes('rent_control') || tg.includes('tenant_rights')) {
        housingScore += 0.5;
      }
      if (tg.includes('eviction') || tg.includes('rent_increase')) {
        housingScore -= 0.4;
      }
    }
    
    if (housingType === 'informal settlement') {
      if (tg.includes('slum') || tg.includes('housing_scheme') || tg.includes('regularization')) {
        housingScore += 0.6; // Major improvement opportunity
      }
      if (tg.includes('demolition') || tg.includes('eviction')) {
        housingScore -= 0.8; // Severe inconvenience
      }
    }
    
    if (housingType === 'owned') {
      if (tg.includes('property_tax') && policy.impacts?.economicCost > 0) {
        housingScore -= 0.2;
      }
      if (tg.includes('home_improvement') || tg.includes('subsidy')) {
        housingScore += 0.3;
      }
    }
    
    // Housing cost burden affects sensitivity
    if (housingCostBurden > 40) {
      // High housing costs = more sensitive to housing policies
      housingScore *= 1.3;
    }
    
    // Infrastructure improvements near housing
    if (domain === 'infrastructure') {
      if (tg.includes('water') || tg.includes('electricity') || tg.includes('sanitation')) {
        if (urbanization === 'rural') {
          housingScore += 0.4; // Rural benefits more
        } else {
          housingScore += 0.2;
        }
      }
      if (tg.includes('road') || tg.includes('street_light')) {
        housingScore += 0.2;
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, housingScore)) * 0.08; // 8% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 7: EDUCATION & SKILL ACCESS
  // ============================================================
  
  let educationScore = 0;
  
  if (domain === 'education') {
    // Households with potential students
    if (householdSize >= 3 && age >= 25 && age <= 50) {
      // Likely have school-age children
      if (tg.includes('school') || tg.includes('student') || tg.includes('education')) {
        educationScore += 0.4;
      }
      if (tg.includes('nearby_school') || tg.includes('transport_school')) {
        educationScore += 0.3;
      }
    }
    
    // Young people seeking education
    if (age >= 18 && age <= 30) {
      if (tg.includes('college') || tg.includes('university') || tg.includes('skill')) {
        educationScore += 0.5;
      }
      if (tg.includes('scholarship') || tg.includes('fee_reduction')) {
        educationScore += 0.4;
      }
    }
    
    // Current education level affects perception
    if (educationLevel <= 2) {
      // Less educated value education access more
      if (policy.impacts?.economicBenefit > 0) {
        educationScore += 0.3;
      }
    }
    
    // Digital education
    if (tg.includes('online_education') || tg.includes('e-learning')) {
      if (internetConnectivity !== 'none' && digitalLiteracy >= 3) {
        educationScore += 0.3;
      } else {
        educationScore -= 0.2; // Can't access
      }
    }
    
    // Rural education access
    if (urbanization === 'rural') {
      if (tg.includes('rural_school') || tg.includes('midday_meal')) {
        educationScore += 0.35;
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, educationScore)) * 0.05; // 5% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 8: WORK & EMPLOYMENT CONVENIENCE
  // ============================================================
  
  let workScore = 0;
  
  if (domain === 'employment' || domain === 'infrastructure') {
    // Employment type affects work convenience
    if (employmentType === 'formal') {
      if (tg.includes('office') || tg.includes('workplace') || tg.includes('parking')) {
        workScore += 0.3;
      }
      if (tg.includes('work_from_home') || tg.includes('flexible')) {
        if (internetConnectivity !== 'none') {
          workScore += 0.4;
        }
      }
    }
    
    if (employmentType === 'informal') {
      if (tg.includes('vendor') || tg.includes('hawker') || tg.includes('street')) {
        workScore += 0.4;
      }
      if (tg.includes('license') || tg.includes('permit') && policy.impacts?.economicCost > 0) {
        workScore -= 0.3; // Red tape inconvenience
      }
    }
    
    if (employmentType === 'self-employed') {
      if (tg.includes('small_business') || tg.includes('msme') || tg.includes('shop')) {
        workScore += 0.35;
      }
      // Compliance requirements
      if (tg.includes('gst') || tg.includes('compliance') || tg.includes('filing')) {
        if (digitalLiteracy >= 3) {
          workScore -= 0.1; // Some inconvenience
        } else {
          workScore -= 0.3; // Major inconvenience for non-digital
        }
      }
    }
    
    if (occupation === 'agriculture') {
      if (tg.includes('mandi') || tg.includes('market') || tg.includes('cold_storage')) {
        workScore += 0.4; // Better market access
      }
      if (tg.includes('irrigation') || tg.includes('water')) {
        workScore += 0.35;
      }
    }
    
    // Commute convenience for all workers
    if (employmentType !== 'unemployed') {
      if (domain === 'transport' || tg.includes('commute')) {
        if (commuteTime > 45) {
          workScore *= 1.3; // Long commuters very sensitive
        }
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, workScore)) * 0.05; // 5% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 9: ENVIRONMENTAL QUALITY OF LIFE
  // ============================================================
  
  let envScore = 0;
  
  if (domain === 'environment' || environmentImpact !== 0) {
    // Pollution exposure sensitivity
    if (pollutionExposure > 150) { // High AQI
      if (environmentImpact > 0 || tg.includes('pollution_control')) {
        envScore += 0.5; // Major relief
      }
    } else if (pollutionExposure > 100) {
      envScore += 0.3;
    }
    
    // Climate vulnerability
    if (climateVulnerability >= 4) {
      if (tg.includes('climate') || tg.includes('flood') || tg.includes('drought')) {
        envScore += 0.4;
      }
    }
    
    // Green space access
    if (greenSpaceAccess < 15) {
      if (tg.includes('park') || tg.includes('green_space') || tg.includes('plantation')) {
        envScore += 0.35;
      }
    }
    
    // Health impact of environment
    if (diseaseRisk > 50 && environmentImpact > 0) {
      envScore += 0.25; // Health-conscious appreciate environmental improvements
    }
    
    // Education affects environmental awareness
    if (educationLevel >= 3) {
      envScore *= 1.2; // Educated care more about environment
    }
    
    // Urban areas often have worse pollution
    if (urbanization === 'urban' && pollutionExposure > 100) {
      envScore *= 1.2;
    }
    
    totalScore += Math.max(-1, Math.min(1, envScore)) * 0.02; // 2% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 10: CHANGE ADAPTABILITY MODIFIER
  // ============================================================
  
  // How easily can this person adapt to convenience changes?
  let adaptabilityModifier = 1.0;
  
  // Change adaptability directly affects how they perceive inconvenience
  if (changeAdaptability >= 4) {
    adaptabilityModifier = 0.85; // High adaptability reduces inconvenience perception
  } else if (changeAdaptability <= 2) {
    adaptabilityModifier = 1.2; // Low adaptability amplifies inconvenience
  }
  
  // Age affects adaptability to new systems
  if (age > 60) {
    adaptabilityModifier *= 1.15; // Elderly may struggle with changes
  } else if (age < 30) {
    adaptabilityModifier *= 0.9; // Youth adapt faster
  }
  
  // Education affects ability to understand and adapt
  if (educationLevel >= 3) {
    adaptabilityModifier *= 0.9;
  } else if (educationLevel <= 1) {
    adaptabilityModifier *= 1.1;
  }
  
  // Apply adaptability modifier (affects negative scores more)
  if (totalScore < 0) {
    totalScore *= adaptabilityModifier;
  } else {
    // Positive changes are still felt, but adaptable people appreciate them less
    totalScore *= (2 - adaptabilityModifier);
  }
  
  
  // ============================================================
  // FINAL SCORE CALCULATION
  // ============================================================
  
  // Ensure score is within bounds
  let finalScore = Math.max(-1, Math.min(1, totalScore));
  
  // If no relevant factors were found, return minimal impact
  if (factorCount === 0) {
    return 0;
  }
  
  return finalScore;
}


/**
 * Get detailed breakdown of convenience impact components
 * Useful for debugging and understanding the score
 */
function getConvenienceImpactBreakdown(human, policy) {
  const totalScore = calculateConvenienceImpact(human, policy);
  
  return {
    totalScore,
    humanProfile: {
      commuteTime: human.mobility?.commuteTime,
      transportMode: human.mobility?.transportationMode,
      internetConnectivity: human.digital?.internetConnectivity,
      digitalLiteracy: human.digital?.digitalLiteracy,
      employmentType: human.socioEconomic?.employmentType,
      urbanization: human.demographics?.urbanization,
      age: human.demographics?.age,
      changeAdaptability: human.behavioral?.changeAdaptability
    },
    policyInfo: {
      domain: policy.domain,
      timeChange: policy.impacts?.timeChange,
      targetGroups: policy.targetGroups || []
    }
  };
}


// Export functions
export { calculateConvenienceImpact, getConvenienceImpactBreakdown };
