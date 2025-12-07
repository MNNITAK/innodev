/**
 * HEALTH & ENVIRONMENT IMPACT CALCULATOR - COMPREHENSIVE
 * 
 * Analyzes how a policy affects a person's health outcomes and environmental quality.
 * 
 * Uses ALL 50+ human factors to determine:
 * 1. Direct health impact (disease risk, healthcare access, age vulnerability)
 * 2. Nutritional and lifestyle impact
 * 3. Mental health and stress factors
 * 4. Environmental pollution and climate effects
 * 5. Green space and nature access
 * 6. Occupational health risks
 * 7. Housing and living condition health effects
 * 8. Water, sanitation, and hygiene factors
 * 
 * Key insight: Health & environment sensitivity depends on:
 * - Current health status and vulnerabilities
 * - Age (children and elderly more vulnerable)
 * - Geographic location (pollution, climate exposure)
 * - Socioeconomic status (ability to mitigate risks)
 * - Education (awareness of health/environment issues)
 * - Occupation (exposure risks)
 */

/**
 * Calculate comprehensive health and environment impact of a policy
 * @param {Object} human - Human with all demographic/socio-economic data
 * @param {Object} policy - Parsed policy with domain, targetGroups, and impacts
 * @returns {number} Health/Environment impact score (-1 to +1)
 */
function calculateHealthEnvironmentImpact(human, policy) {
  let totalScore = 0;
  let factorCount = 0;
  
  const domain = policy.domain?.toLowerCase() || 'general';
  const targetGroups = policy.targetGroups || [];
  const tg = targetGroups.map(g => g.toLowerCase());
  
  // Policy impact values
  const healthImpact = policy.impacts?.healthImpact || 0; // -100 to +100
  const environmentImpact = policy.impacts?.environmentImpact || 0; // -100 to +100
  
  // ========== EXTRACT ALL HUMAN FACTORS ==========
  
  // === 1. DEMOGRAPHICS ===
  const age = human.demographics?.age || 35;
  const sex = human.demographics?.sex?.toLowerCase() || 'male';
  const householdSize = human.demographics?.householdSize || 4;
  const urbanization = human.demographics?.urbanization?.toLowerCase() || 'rural';
  const religion = human.demographics?.religion?.toLowerCase() || 'hindu';
  const caste = human.demographics?.caste?.toLowerCase() || 'general';
  const tribalConcentration = human.demographics?.tribalConcentration || 0;
  
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
  const bmi = human.health?.nutritionalStatus?.bmi || 22;
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
  const pollutionExposure = human.environmental?.pollutionExposure || 50; // AQI 0-500
  const climateVulnerability = human.environmental?.climateVulnerability || 3; // 1-5
  const greenSpaceAccess = human.environmental?.greenSpaceAccess || 20; // 0-100
  
  // === 12. LEGAL ===
  const citizenshipStatus = human.legal?.citizenshipStatus?.toLowerCase() || 'citizen';
  const criminalRecord = human.legal?.criminalRecord || false;
  
  // === 13. INFORMATION ===
  const policyAwareness = human.information?.policyAwareness || 2;
  
  
  // ============================================================
  // SECTION 1: HEALTH VULNERABILITY ASSESSMENT
  // How vulnerable is this person to health impacts?
  // ============================================================
  
  let healthVulnerability = 0.5; // Base vulnerability
  
  // Age-based vulnerability (U-shaped curve)
  if (age < 5) {
    healthVulnerability += 0.4; // Infants very vulnerable
  } else if (age < 18) {
    healthVulnerability += 0.2; // Children vulnerable
  } else if (age >= 60 && age < 70) {
    healthVulnerability += 0.25;
  } else if (age >= 70) {
    healthVulnerability += 0.4; // Elderly very vulnerable
  }
  
  // Current disease risk
  if (diseaseRisk > 70) {
    healthVulnerability += 0.35;
  } else if (diseaseRisk > 50) {
    healthVulnerability += 0.2;
  } else if (diseaseRisk > 30) {
    healthVulnerability += 0.1;
  }
  
  // Nutritional status
  if (bmiCategory === 'underweight') {
    healthVulnerability += 0.25; // Malnourished more vulnerable
  } else if (bmiCategory === 'obese') {
    healthVulnerability += 0.2; // Obesity increases health risks
  } else if (bmiCategory === 'overweight') {
    healthVulnerability += 0.1;
  }
  
  // Healthcare access affects ability to respond to health impacts
  if (healthcareAccess < 30) {
    healthVulnerability += 0.25; // Poor access = higher vulnerability
  } else if (healthcareAccess < 50) {
    healthVulnerability += 0.15;
  } else if (healthcareAccess > 80) {
    healthVulnerability -= 0.1; // Good access = better mitigation
  }
  
  // Poverty increases health vulnerability
  if (povertyStatus === 1) {
    healthVulnerability += 0.2;
  } else if (income < 5000) {
    healthVulnerability += 0.15;
  }
  
  // Women of reproductive age
  if (sex === 'female' && age >= 18 && age <= 45) {
    healthVulnerability += 0.1; // Maternal health considerations
  }
  
  // Pregnant women indicator (approximation based on age and household)
  if (sex === 'female' && age >= 20 && age <= 35 && householdSize >= 2) {
    healthVulnerability += 0.05; // Potential pregnancy
  }
  
  healthVulnerability = Math.min(1.5, healthVulnerability);
  
  
  // ============================================================
  // SECTION 2: ENVIRONMENTAL SENSITIVITY ASSESSMENT
  // How sensitive is this person to environmental changes?
  // ============================================================
  
  let envSensitivity = 0.3; // Base sensitivity
  
  // Education increases environmental awareness
  if (educationLevel >= 4) {
    envSensitivity += 0.35;
  } else if (educationLevel >= 3) {
    envSensitivity += 0.25;
  } else if (educationLevel >= 2) {
    envSensitivity += 0.1;
  }
  
  // Health literacy affects understanding of environmental health links
  if (healthLiteracy >= 4) {
    envSensitivity += 0.15;
  } else if (healthLiteracy >= 3) {
    envSensitivity += 0.08;
  }
  
  // Media consumption affects awareness
  if (mediaConsumption === 'both' || mediaConsumption === 'social media') {
    envSensitivity += 0.1;
  }
  
  // Policy awareness
  if (policyAwareness >= 4) {
    envSensitivity += 0.1;
  }
  
  // Income affects ability to care about environment (Maslow hierarchy)
  if (income > 25000) {
    envSensitivity += 0.2; // Affluent can afford to care
  } else if (income > 15000) {
    envSensitivity += 0.1;
  } else if (income < 5000) {
    envSensitivity -= 0.15; // Survival priorities
  }
  
  // Urban dwellers may be more aware of pollution issues
  if (urbanization === 'urban' && pollutionExposure > 100) {
    envSensitivity += 0.15;
  }
  
  // Tribal/rural communities often have direct environmental dependence
  if (caste === 'st' || tribalConcentration > 20) {
    envSensitivity += 0.2; // Tribal communities dependent on forests/nature
  }
  
  // Agriculture workers depend on environment
  if (occupation === 'agriculture') {
    envSensitivity += 0.25;
  }
  
  envSensitivity = Math.min(1.2, envSensitivity);
  
  
  // ============================================================
  // SECTION 3: DIRECT HEALTH POLICY IMPACT
  // ============================================================
  
  let healthScore = 0;
  
  if (domain === 'health' || healthImpact !== 0 || 
      tg.some(g => ['health', 'hospital', 'medicine', 'doctor', 'patient', 'healthcare'].includes(g))) {
    
    // --- 3.1 Direct Health Impact from Policy ---
    if (healthImpact !== 0) {
      // Base impact scaled by vulnerability
      healthScore += (healthImpact / 100) * healthVulnerability;
    }
    
    // --- 3.2 Healthcare Access Policies ---
    if (tg.includes('healthcare') || tg.includes('hospital') || tg.includes('clinic')) {
      // Those with poor current access benefit more
      if (healthcareAccess < 40) {
        healthScore += 0.5;
      } else if (healthcareAccess < 60) {
        healthScore += 0.3;
      } else {
        healthScore += 0.15;
      }
    }
    
    // Free/subsidized healthcare
    if (tg.includes('free_healthcare') || tg.includes('ayushman') || tg.includes('insurance')) {
      if (povertyStatus === 1) {
        healthScore += 0.6;
      } else if (income < 8000) {
        healthScore += 0.45;
      } else if (income < 15000) {
        healthScore += 0.3;
      } else {
        healthScore += 0.15;
      }
    }
    
    // Medicine/drug policies
    if (tg.includes('medicine') || tg.includes('drug') || tg.includes('pharmacy')) {
      if (diseaseRisk > 50) {
        healthScore += 0.4; // Chronic patients benefit more
      } else if (age > 60) {
        healthScore += 0.35;
      } else {
        healthScore += 0.15;
      }
    }
    
    // --- 3.3 Maternal and Child Health ---
    if (tg.includes('maternal') || tg.includes('pregnancy') || tg.includes('anganwadi')) {
      if (sex === 'female' && age >= 18 && age <= 45) {
        healthScore += 0.5;
      }
      if (householdSize >= 3) {
        healthScore += 0.3; // Families with children
      }
    }
    
    if (tg.includes('child_health') || tg.includes('immunization') || tg.includes('vaccination')) {
      if (householdSize >= 3 && age >= 20 && age <= 50) {
        healthScore += 0.45; // Parents
      }
    }
    
    // --- 3.4 Nutrition Programs ---
    if (tg.includes('nutrition') || tg.includes('midday_meal') || tg.includes('ration') || tg.includes('pds')) {
      if (bmiCategory === 'underweight') {
        healthScore += 0.55;
      }
      if (povertyStatus === 1) {
        healthScore += 0.45;
      }
      if (householdSize >= 4) {
        healthScore += 0.25;
      }
    }
    
    // --- 3.5 Mental Health ---
    if (tg.includes('mental_health') || tg.includes('counseling') || tg.includes('stress')) {
      // Debt and income instability affect mental health
      if (debtVulnerability > 50) {
        healthScore += 0.4;
      }
      if (incomeStability <= 2) {
        healthScore += 0.3;
      }
      // Urban stress
      if (urbanization === 'urban' && commuteTime > 45) {
        healthScore += 0.25;
      }
    }
    
    // --- 3.6 Elderly Health ---
    if (tg.includes('elderly') || tg.includes('senior') || tg.includes('geriatric')) {
      if (age >= 60) {
        healthScore += 0.55;
      } else if (age >= 50) {
        healthScore += 0.25;
      }
    }
    
    // --- 3.7 Disease-Specific Policies ---
    if (tg.includes('diabetes') || tg.includes('heart') || tg.includes('cancer') || 
        tg.includes('tb') || tg.includes('malaria') || tg.includes('chronic')) {
      if (diseaseRisk > 60) {
        healthScore += 0.5;
      } else if (diseaseRisk > 40) {
        healthScore += 0.3;
      }
    }
    
    // --- 3.8 Rural Health ---
    if (tg.includes('rural_health') || tg.includes('phc') || tg.includes('asha')) {
      if (urbanization === 'rural') {
        healthScore += 0.45;
        if (healthcareAccess < 50) {
          healthScore += 0.2;
        }
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, healthScore)) * 0.5; // 50% weight for health
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 4: ENVIRONMENTAL POLICY IMPACT
  // ============================================================
  
  let envScore = 0;
  
  if (domain === 'environment' || environmentImpact !== 0 ||
      tg.some(g => ['environment', 'pollution', 'climate', 'forest', 'water', 'air'].includes(g))) {
    
    // --- 4.1 Direct Environmental Impact from Policy ---
    if (environmentImpact !== 0) {
      envScore += (environmentImpact / 100) * envSensitivity;
    }
    
    // --- 4.2 Air Pollution Policies ---
    if (tg.includes('air') || tg.includes('pollution') || tg.includes('emissions') || tg.includes('aqi')) {
      // Current pollution exposure determines benefit
      if (pollutionExposure > 200) { // Severe pollution
        envScore += 0.6;
      } else if (pollutionExposure > 150) { // Very unhealthy
        envScore += 0.45;
      } else if (pollutionExposure > 100) { // Unhealthy
        envScore += 0.3;
      } else if (pollutionExposure > 50) { // Moderate
        envScore += 0.15;
      }
      
      // Urban areas often have worse air quality
      if (urbanization === 'urban') {
        envScore *= 1.2;
      }
      
      // Health-vulnerable people benefit more from clean air
      if (diseaseRisk > 50 || age > 60 || age < 10) {
        envScore *= 1.25;
      }
    }
    
    // --- 4.3 Water Quality and Access ---
    if (tg.includes('water') || tg.includes('drinking_water') || tg.includes('sanitation')) {
      // Rural areas often lack clean water
      if (urbanization === 'rural') {
        envScore += 0.5;
      } else if (urbanization === 'semi-urban') {
        envScore += 0.35;
      } else {
        envScore += 0.2;
      }
      
      // Poverty affects water access
      if (povertyStatus === 1) {
        envScore += 0.25;
      }
      
      // Informal settlements lack water infrastructure
      if (housingType === 'informal settlement') {
        envScore += 0.4;
      }
    }
    
    // --- 4.4 Climate Change and Disaster Policies ---
    if (tg.includes('climate') || tg.includes('flood') || tg.includes('drought') || 
        tg.includes('cyclone') || tg.includes('disaster')) {
      // Climate vulnerability determines impact
      if (climateVulnerability >= 4) {
        envScore += 0.55;
      } else if (climateVulnerability >= 3) {
        envScore += 0.35;
      } else {
        envScore += 0.15;
      }
      
      // Agriculture workers most affected by climate
      if (occupation === 'agriculture') {
        envScore += 0.4;
      }
      
      // Rural areas more exposed to climate events
      if (urbanization === 'rural') {
        envScore += 0.2;
      }
    }
    
    // --- 4.5 Forest and Nature Conservation ---
    if (tg.includes('forest') || tg.includes('conservation') || tg.includes('wildlife') || 
        tg.includes('biodiversity')) {
      // Tribal communities dependent on forests
      if (caste === 'st' || tribalConcentration > 20) {
        // Could be positive (protection) or negative (restrictions)
        if (tg.includes('rights') || tg.includes('access')) {
          envScore += 0.5;
        } else if (tg.includes('restriction') || tg.includes('eviction')) {
          envScore -= 0.6;
        } else {
          envScore += 0.3;
        }
      }
      
      // Rural communities near forests
      if (urbanization === 'rural') {
        envScore += 0.2;
      }
      
      // Educated urban people care about conservation
      if (urbanization === 'urban' && educationLevel >= 3) {
        envScore += 0.25;
      }
    }
    
    // --- 4.6 Green Space and Parks ---
    if (tg.includes('park') || tg.includes('green_space') || tg.includes('garden') || 
        tg.includes('plantation') || tg.includes('urban_forest')) {
      // Those with poor green space access benefit more
      if (greenSpaceAccess < 15) {
        envScore += 0.45;
      } else if (greenSpaceAccess < 30) {
        envScore += 0.3;
      } else {
        envScore += 0.15;
      }
      
      // Urban areas need more green space
      if (urbanization === 'urban') {
        envScore *= 1.2;
      }
      
      // Health benefits of green space
      if (diseaseRisk > 40) {
        envScore += 0.1;
      }
    }
    
    // --- 4.7 Waste Management ---
    if (tg.includes('waste') || tg.includes('garbage') || tg.includes('recycling') || 
        tg.includes('swachh') || tg.includes('cleanliness')) {
      // Urban areas have more waste problems
      if (urbanization === 'urban') {
        envScore += 0.35;
      } else if (urbanization === 'semi-urban') {
        envScore += 0.25;
      }
      
      // Informal settlements lack waste collection
      if (housingType === 'informal settlement') {
        envScore += 0.4;
      }
      
      // Health literacy affects appreciation
      if (healthLiteracy >= 3) {
        envScore += 0.1;
      }
    }
    
    // --- 4.8 Renewable Energy and Clean Tech ---
    if (tg.includes('solar') || tg.includes('renewable') || tg.includes('clean_energy') || 
        tg.includes('electric_vehicle')) {
      // Higher income can afford adoption
      if (income > 20000) {
        envScore += 0.4;
      } else if (income > 10000) {
        envScore += 0.25;
      }
      
      // Rural solar benefits (no grid electricity)
      if (urbanization === 'rural' && tg.includes('solar')) {
        envScore += 0.35;
      }
      
      // Education affects appreciation
      if (educationLevel >= 3) {
        envScore += 0.15;
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, envScore)) * 0.35; // 35% weight for environment
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 5: OCCUPATIONAL HEALTH & SAFETY
  // ============================================================
  
  let occupationalScore = 0;
  
  if (tg.some(g => ['worker', 'occupational', 'safety', 'labor', 'factory'].includes(g)) ||
      domain === 'employment') {
    
    // Manufacturing workers face occupational hazards
    if (occupation === 'manufacturing') {
      if (tg.includes('safety') || tg.includes('protection') || tg.includes('insurance')) {
        occupationalScore += 0.5;
      }
      if (employmentType === 'informal') {
        occupationalScore += 0.25; // Informal workers lack protections
      }
    }
    
    // Agricultural workers face pesticide/chemical exposure
    if (occupation === 'agriculture') {
      if (tg.includes('pesticide') || tg.includes('chemical') || tg.includes('organic')) {
        occupationalScore += 0.4;
      }
      // Heat stress for outdoor workers
      if (tg.includes('heat') || tg.includes('shade') || tg.includes('rest')) {
        occupationalScore += 0.35;
      }
    }
    
    // Informal sector workers lack health protections
    if (employmentType === 'informal') {
      if (tg.includes('informal') || tg.includes('unorganized')) {
        occupationalScore += 0.4;
      }
    }
    
    // Construction workers
    if (tg.includes('construction') || tg.includes('builder')) {
      if (occupation === 'manufacturing' || occupation === 'informal') {
        occupationalScore += 0.45;
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, occupationalScore)) * 0.08; // 8% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 6: HOUSING & LIVING CONDITIONS HEALTH
  // ============================================================
  
  let housingHealthScore = 0;
  
  if (domain === 'housing' || domain === 'infrastructure') {
    // Informal settlements have poor sanitation
    if (housingType === 'informal settlement') {
      if (tg.includes('sanitation') || tg.includes('toilet') || tg.includes('sewage')) {
        housingHealthScore += 0.55;
      }
      if (tg.includes('drainage') || tg.includes('waterlogging')) {
        housingHealthScore += 0.4; // Prevents disease spread
      }
    }
    
    // Overcrowding health issues
    if (householdSize >= 6) {
      if (tg.includes('housing') || tg.includes('space')) {
        housingHealthScore += 0.3;
      }
    }
    
    // Ventilation and air quality in homes
    if (tg.includes('ventilation') || tg.includes('indoor_air') || tg.includes('lpg') || 
        tg.includes('cooking_fuel')) {
      // Poor households often use solid fuels (wood, dung)
      if (povertyStatus === 1 || urbanization === 'rural') {
        housingHealthScore += 0.45; // Major health improvement from clean cooking
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, housingHealthScore)) * 0.05; // 5% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 7: LIFESTYLE & PREVENTIVE HEALTH
  // ============================================================
  
  let lifestyleScore = 0;
  
  if (tg.some(g => ['fitness', 'yoga', 'sports', 'exercise', 'wellness', 'prevention'].includes(g))) {
    // Higher income/education pursue wellness
    if (income > 15000 && educationLevel >= 3) {
      lifestyleScore += 0.35;
    }
    
    // Those with health issues value prevention
    if (diseaseRisk > 40) {
      lifestyleScore += 0.3;
    }
    
    // Age affects interest in wellness
    if (age >= 40 && age <= 65) {
      lifestyleScore += 0.2;
    }
    
    // Urban populations have more access to fitness facilities
    if (urbanization === 'urban') {
      lifestyleScore += 0.15;
    }
    
    totalScore += Math.max(-1, Math.min(1, lifestyleScore)) * 0.02; // 2% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 8: TRANSPORT-RELATED HEALTH EFFECTS
  // ============================================================
  
  let transportHealthScore = 0;
  
  if (domain === 'transport') {
    // Long commutes affect health (stress, sedentary)
    if (commuteTime > 60) {
      if (tg.includes('reduce_commute') || tg.includes('work_from_home')) {
        transportHealthScore += 0.4;
      }
    }
    
    // Active transport health benefits
    if (tg.includes('cycle') || tg.includes('walking') || tg.includes('pedestrian')) {
      if (transportMode === 'walk' || transportMode === 'bike') {
        transportHealthScore += 0.3;
      }
      // Health-conscious may switch to active transport
      if (healthLiteracy >= 3 && age < 50) {
        transportHealthScore += 0.2;
      }
    }
    
    // Public transport reduces pollution vs cars
    if (tg.includes('public_transport') || tg.includes('metro') || tg.includes('bus')) {
      if (urbanization === 'urban' && pollutionExposure > 100) {
        transportHealthScore += 0.25; // Pollution reduction benefit
      }
    }
    
    // Road safety
    if (tg.includes('safety') || tg.includes('accident') || tg.includes('helmet')) {
      if (transportMode === 'bike') {
        transportHealthScore += 0.35;
      }
      if (transportMode === 'car') {
        transportHealthScore += 0.25;
      }
    }
    
    totalScore += Math.max(-1, Math.min(1, transportHealthScore));
    factorCount++;
  }
  
  
  // ============================================================
  // FINAL SCORE CALCULATION
  // ============================================================
  
  // Apply overall health literacy modifier
  // Higher health literacy = better appreciation of health benefits
  let literacyModifier = 1.0;
  if (healthLiteracy >= 4) {
    literacyModifier = 1.15;
  } else if (healthLiteracy >= 3) {
    literacyModifier = 1.05;
  } else if (healthLiteracy <= 2) {
    literacyModifier = 0.9;
  }
  
  totalScore *= literacyModifier;
  
  // Apply institutional trust modifier
  // Low trust = skepticism about health/env policy benefits
  if (institutionalTrust < 30) {
    totalScore *= 0.85;
  } else if (institutionalTrust > 70) {
    totalScore *= 1.1;
  }
  
  // Ensure score is within bounds
  let finalScore = Math.max(-1, Math.min(1, totalScore));
  
  // If no relevant factors were found, calculate basic impact
  if (factorCount === 0 && (healthImpact !== 0 || environmentImpact !== 0)) {
    // Fallback to simple calculation
    const simpleHealth = (healthImpact / 100) * healthVulnerability * 0.6;
    const simpleEnv = (environmentImpact / 100) * envSensitivity * 0.4;
    finalScore = Math.max(-1, Math.min(1, simpleHealth + simpleEnv));
  }
  
  return finalScore;
}


/**
 * Get detailed breakdown of health/environment impact components
 * Useful for debugging and understanding the score
 */
function getHealthEnvironmentBreakdown(human, policy) {
  const totalScore = calculateHealthEnvironmentImpact(human, policy);
  
  return {
    totalScore,
    humanProfile: {
      age: human.demographics?.age,
      diseaseRisk: human.health?.diseaseRisk,
      healthcareAccess: human.health?.healthcareAccess,
      healthLiteracy: human.health?.healthLiteracy,
      bmiCategory: human.health?.nutritionalStatus?.category,
      pollutionExposure: human.environmental?.pollutionExposure,
      climateVulnerability: human.environmental?.climateVulnerability,
      greenSpaceAccess: human.environmental?.greenSpaceAccess,
      educationLevel: human.socioEconomic?.educationLevel,
      occupation: human.socioEconomic?.occupation,
      urbanization: human.demographics?.urbanization
    },
    policyInfo: {
      domain: policy.domain,
      healthImpact: policy.impacts?.healthImpact,
      environmentImpact: policy.impacts?.environmentImpact,
      targetGroups: policy.targetGroups || []
    }
  };
}


// Export functions
export { calculateHealthEnvironmentImpact, getHealthEnvironmentBreakdown };
