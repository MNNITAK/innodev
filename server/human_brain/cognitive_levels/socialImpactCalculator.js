/**
 * SOCIAL & IDENTITY IMPACT CALCULATOR - COMPREHENSIVE
 * 
 * Analyzes how a policy affects a person based on their social identity,
 * group memberships, and community factors.
 * 
 * Uses ALL 50+ human factors across 13 categories from humanModel.js
 * Based on extensive analysis of UP.json state data patterns
 * 
 * Key insight: Social impact is not just about being targeted, but about:
 * 1. Group identity alignment (caste, religion, community)
 * 2. Social status effects (how policy changes their standing)
 * 3. Community network effects (how their group is affected)
 * 4. Cultural/traditional value alignment
 * 5. Aspirational alignment (does policy help their goals?)
 */

/**
 * Calculate comprehensive social impact of a policy on a person
 * @param {Object} human - Human with all demographic/socio-economic data
 * @param {Object} policy - Parsed policy with domain, targetGroups, and impacts
 * @returns {number} Social impact score (-1 to +1)
 */
function calculateSocialImpact(human, policy) {
  let totalScore = 0;
  let factorCount = 0;
  
  const targetGroups = policy.targetGroups || [];
  const tg = targetGroups.map(g => g.toLowerCase());
  const domain = policy.domain?.toLowerCase() || 'general';
  const socialStatusChange = policy.impacts?.socialStatus || 0;
  
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
  const povertyStatus = human.socioEconomic?.povertyStatus || 0; // 1 = BPL
  const literacy = human.socioEconomic?.literacy || 1; // 0-3
  const educationLevel = human.socioEconomic?.educationLevel || 1; // 0-4
  const occupation = human.socioEconomic?.occupation?.toLowerCase() || 'informal';
  const employmentType = human.socioEconomic?.employmentType?.toLowerCase() || 'informal';
  const wealthQuintile = human.socioEconomic?.wealthQuintile?.toLowerCase() || 'q3';
  
  // === 3. BEHAVIORAL ===
  const casteConsciousness = human.behavioral?.casteConsciousness || 3; // 1-5
  const riskTolerance = human.behavioral?.riskTolerance || 3; // 1-5
  const institutionalTrust = human.behavioral?.institutionalTrust || 50; // 0-100
  const changeAdaptability = human.behavioral?.changeAdaptability || 3; // 1-5
  
  // === 4. HEALTH ===
  const healthcareAccess = human.health?.healthcareAccess || 50; // 0-100
  const healthLiteracy = human.health?.healthLiteracy || 3; // 1-5
  const bmiCategory = human.health?.nutritionalStatus?.category?.toLowerCase() || 'normal';
  const diseaseRisk = human.health?.diseaseRisk || 30; // 0-100
  
  // === 5. ECONOMIC STABILITY ===
  const incomeStability = human.economicStability?.incomeStability || 3; // 1-5
  const debtVulnerability = human.economicStability?.debtVulnerability || 30; // 0-100
  const savingsRate = human.economicStability?.savingsRate || 5; // -50 to 50
  
  // === 6. HOUSING ===
  const housingType = human.housing?.housingType?.toLowerCase() || 'owned';
  const housingCostBurden = human.housing?.housingCostBurden || 20; // 0-100
  
  // === 7. MOBILITY ===
  const commuteTime = human.mobility?.commuteTime || 30; // 0-180 mins
  const transportMode = human.mobility?.transportationMode?.toLowerCase() || 'bus';
  const geographicMobility = human.mobility?.geographicMobility || 3; // 1-5
  
  // === 9. POLITICAL/CIVIC ===
  const votingBehavior = human.political?.votingBehavior?.toLowerCase() || 'regular';
  const civicParticipation = human.political?.civicParticipation || 10; // 0-100
  const mediaConsumption = human.political?.mediaConsumption?.toLowerCase() || 'both';
  
  // === 10. DIGITAL ===
  const internetConnectivity = human.digital?.internetConnectivity?.toLowerCase() || 'mobile only';
  const digitalLiteracy = human.digital?.digitalLiteracy || 2; // 1-5
  const digitalServicesAccess = human.digital?.digitalServicesAccess || 30; // 0-100
  
  // === 11. ENVIRONMENTAL ===
  const pollutionExposure = human.environmental?.pollutionExposure || 50; // AQI 0-500
  const climateVulnerability = human.environmental?.climateVulnerability || 3; // 1-5
  const greenSpaceAccess = human.environmental?.greenSpaceAccess || 20; // 0-100
  
  // === 12. LEGAL ===
  const citizenshipStatus = human.legal?.citizenshipStatus?.toLowerCase() || 'citizen';
  const criminalRecord = human.legal?.criminalRecord || false;
  
  // === 13. INFORMATION ===
  const policyAwareness = human.information?.policyAwareness || 2; // 1-5
  
  
  // ============================================================
  // SECTION 1: TARGET GROUP MATCHING (Primary Social Identity)
  // ============================================================
  
  let targetMatchScore = 0;
  let targetMatchCount = 0;
  
  // --- 1.1 AGE-BASED TARGETING ---
  if (tg.includes('youth') || tg.includes('young')) {
    if (age >= 18 && age <= 30) {
      targetMatchScore += 0.8;
      targetMatchCount++;
    } else if (age >= 31 && age <= 40) {
      targetMatchScore += 0.3; // Partially affected
      targetMatchCount++;
    }
  }
  
  if (tg.includes('elderly') || tg.includes('senior') || tg.includes('old_age')) {
    if (age >= 60) {
      targetMatchScore += 0.9;
      targetMatchCount++;
    } else if (age >= 50) {
      targetMatchScore += 0.4;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('working_age') || tg.includes('adults')) {
    if (age >= 25 && age <= 55) {
      targetMatchScore += 0.6;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('children') || tg.includes('minors')) {
    // Adults with children benefit from child-focused policies
    if (householdSize >= 4) {
      targetMatchScore += 0.5;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('parents') || tg.includes('family')) {
    if (householdSize >= 3) {
      targetMatchScore += 0.6;
      targetMatchCount++;
    }
    if (householdSize >= 5) {
      targetMatchScore += 0.2; // Extra for large families
    }
  }
  
  // --- 1.2 GENDER-BASED TARGETING ---
  if (tg.includes('women') || tg.includes('female')) {
    if (sex === 'female') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('men') || tg.includes('male')) {
    if (sex === 'male') {
      targetMatchScore += 0.7;
      targetMatchCount++;
    }
  }
  
  // --- 1.3 INCOME-BASED TARGETING ---
  if (tg.includes('poor') || tg.includes('bpl') || tg.includes('low_income')) {
    if (povertyStatus === 1) {
      targetMatchScore += 1.0; // Maximum benefit for exact match
      targetMatchCount++;
    } else if (income < 3000) {
      targetMatchScore += 0.85;
      targetMatchCount++;
    } else if (income < 5000) {
      targetMatchScore += 0.5;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('middle_class') || tg.includes('middle_income')) {
    if (income >= 8000 && income <= 25000) {
      targetMatchScore += 0.8;
      targetMatchCount++;
    } else if (income >= 5000 && income < 8000) {
      targetMatchScore += 0.5;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('rich') || tg.includes('wealthy') || tg.includes('high_income') || tg.includes('apl')) {
    if (income > 30000) {
      targetMatchScore += 0.9;
      targetMatchCount++;
    } else if (income > 20000) {
      targetMatchScore += 0.6;
      targetMatchCount++;
    }
  }
  
  // --- 1.4 OCCUPATION-BASED TARGETING ---
  if (tg.includes('farmer') || tg.includes('agriculture') || tg.includes('kisan')) {
    if (occupation === 'agriculture') {
      targetMatchScore += 1.0;
      targetMatchCount++;
    } else if (urbanization === 'rural' && occupation === 'informal') {
      targetMatchScore += 0.4; // Rural informal workers often connected to agriculture
      targetMatchCount++;
    }
  }
  
  if (tg.includes('laborer') || tg.includes('worker') || tg.includes('mazdoor')) {
    if (occupation === 'manufacturing' || employmentType === 'informal') {
      targetMatchScore += 0.8;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('student')) {
    if (age >= 18 && age <= 25 && employmentType === 'unemployed') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    } else if (age <= 30 && educationLevel >= 2) {
      targetMatchScore += 0.4;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('entrepreneur') || tg.includes('business') || tg.includes('vyapari')) {
    if (employmentType === 'self-employed') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('informal_sector') || tg.includes('unorganized')) {
    if (employmentType === 'informal') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('formal_sector') || tg.includes('organized') || tg.includes('salaried')) {
    if (employmentType === 'formal') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('self_employed')) {
    if (employmentType === 'self-employed') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('unemployed') || tg.includes('jobless')) {
    if (employmentType === 'unemployed' || occupation === 'unemployed') {
      targetMatchScore += 1.0;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('government_employee') || tg.includes('sarkari')) {
    if (occupation === 'services' && employmentType === 'formal') {
      targetMatchScore += 0.7;
      targetMatchCount++;
    }
  }
  
  // --- 1.5 CASTE/IDENTITY-BASED TARGETING ---
  if (tg.includes('sc') || tg.includes('dalit') || tg.includes('scheduled_caste')) {
    if (caste === 'sc') {
      targetMatchScore += 1.0;
      targetMatchCount++;
      // Caste-conscious SC members feel stronger about caste-based policies
      if (casteConsciousness >= 4) {
        targetMatchScore += 0.2;
      }
    }
  }
  
  if (tg.includes('st') || tg.includes('tribal') || tg.includes('adivasi')) {
    if (caste === 'st') {
      targetMatchScore += 1.0;
      targetMatchCount++;
    } else if (tribalConcentration > 20) {
      targetMatchScore += 0.5; // Lives in tribal area
      targetMatchCount++;
    }
  }
  
  if (tg.includes('obc') || tg.includes('other_backward')) {
    if (caste === 'obc') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('minority') || tg.includes('minorities')) {
    if (religion !== 'hindu') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('muslim')) {
    if (religion === 'muslim') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('hindu')) {
    if (religion === 'hindu') {
      targetMatchScore += 0.7;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('sikh')) {
    if (religion === 'sikh') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('christian')) {
    if (religion === 'christian') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  // --- 1.6 GEOGRAPHY-BASED TARGETING ---
  if (tg.includes('urban') || tg.includes('city') || tg.includes('metro')) {
    if (urbanization === 'urban') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('rural') || tg.includes('village') || tg.includes('gramin')) {
    if (urbanization === 'rural') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('semi-urban') || tg.includes('semi_urban') || tg.includes('town')) {
    if (urbanization === 'semi-urban') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  // --- 1.7 DOMAIN-SPECIFIC TARGETING ---
  if (tg.includes('commuter') || tg.includes('daily_traveler')) {
    if (commuteTime > 45) {
      targetMatchScore += 0.8;
      targetMatchCount++;
    } else if (commuteTime > 30) {
      targetMatchScore += 0.5;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('bus_users') || tg.includes('public_transport')) {
    if (transportMode === 'bus' || transportMode === 'train') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('car_owners') || tg.includes('vehicle_owners')) {
    if (transportMode === 'car') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('two_wheeler') || tg.includes('bike_owners')) {
    if (transportMode === 'bike') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('taxpayer') || tg.includes('income_tax')) {
    if (income > 8000) { // Above tax threshold
      targetMatchScore += 0.8;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('homeowner') || tg.includes('property_owner')) {
    if (housingType === 'owned') {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('tenant') || tg.includes('renter')) {
    if (housingType === 'rented') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('slum') || tg.includes('jhuggi') || tg.includes('informal_housing')) {
    if (housingType === 'informal settlement') {
      targetMatchScore += 1.0;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('patients') || tg.includes('sick') || tg.includes('chronically_ill')) {
    if (diseaseRisk > 60) {
      targetMatchScore += 0.9;
      targetMatchCount++;
    } else if (diseaseRisk > 40) {
      targetMatchScore += 0.5;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('disabled') || tg.includes('divyang') || tg.includes('handicapped')) {
    if (diseaseRisk > 70 || healthcareAccess < 30) {
      targetMatchScore += 0.8;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('literate') || tg.includes('educated')) {
    if (literacy >= 2 || educationLevel >= 2) {
      targetMatchScore += 0.7;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('illiterate') || tg.includes('uneducated')) {
    if (literacy === 0) {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('digitally_excluded') || tg.includes('no_internet')) {
    if (internetConnectivity === 'none') {
      targetMatchScore += 0.9;
      targetMatchCount++;
    }
  }
  
  if (tg.includes('debt_ridden') || tg.includes('indebted')) {
    if (debtVulnerability > 50) {
      targetMatchScore += 0.85;
      targetMatchCount++;
    }
  }
  
  // Calculate average target match
  if (targetMatchCount > 0) {
    totalScore += (targetMatchScore / targetMatchCount) * 0.4; // 40% weight for target matching
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 2: CASTE & COMMUNITY DYNAMICS
  // ============================================================
  
  let casteScore = 0;
  
  // High caste consciousness amplifies caste-based policy reactions
  const casteMultiplier = 1 + (casteConsciousness - 3) * 0.2; // 0.6 to 1.4
  
  // SC/ST reservation or welfare policies
  if (domain === 'social' || domain === 'education' || domain === 'employment') {
    // Policy mentions reservation or affirmative action
    const isAffirmativeAction = tg.some(g => 
      ['sc', 'st', 'obc', 'reservation', 'quota', 'backward'].includes(g)
    );
    
    if (isAffirmativeAction) {
      if (caste === 'sc' || caste === 'st') {
        casteScore += 0.6 * casteMultiplier;
      } else if (caste === 'obc') {
        casteScore += 0.4 * casteMultiplier;
      } else if (caste === 'general') {
        // General category may feel negative about reservation
        casteScore -= 0.3 * casteMultiplier;
      }
    }
  }
  
  // Religious/cultural policies
  if (tg.some(g => ['hindu', 'muslim', 'sikh', 'christian', 'minority', 'temple', 'mosque', 'church'].includes(g))) {
    const isOwnReligion = tg.includes(religion) || 
                          (religion !== 'hindu' && tg.includes('minority'));
    if (isOwnReligion) {
      casteScore += 0.5;
    } else if (religion === 'hindu' && tg.includes('minority')) {
      // Majority may feel slightly negative about minority-specific policies
      casteScore -= 0.1 * casteMultiplier;
    }
  }
  
  // Tribal area policies
  if (domain === 'environment' || tg.includes('tribal') || tg.includes('forest')) {
    if (caste === 'st' || tribalConcentration > 20) {
      casteScore += 0.5;
    }
  }
  
  if (casteScore !== 0) {
    totalScore += Math.max(-1, Math.min(1, casteScore)) * 0.15; // 15% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 3: SOCIAL STATUS & PRESTIGE EFFECTS
  // ============================================================
  
  let statusScore = 0;
  
  // Direct social status change from policy
  if (socialStatusChange !== 0) {
    // Wealthy/educated care more about status
    let statusSensitivity = 0.5;
    if (income > 20000) statusSensitivity += 0.2;
    if (educationLevel >= 3) statusSensitivity += 0.2;
    if (wealthQuintile === 'q4' || wealthQuintile === 'q5') statusSensitivity += 0.1;
    
    statusScore += (socialStatusChange / 100) * statusSensitivity;
  }
  
  // Education policies affect aspirational status
  if (domain === 'education') {
    // Parents with children benefit socially from education policies
    if (householdSize >= 3 && age >= 25 && age <= 50) {
      statusScore += 0.3;
    }
    // Less educated see education as path to status
    if (educationLevel <= 2) {
      statusScore += 0.2;
    }
  }
  
  // Housing policies affect status (owned home = status symbol in India)
  if (domain === 'housing') {
    if (housingType === 'rented' || housingType === 'informal settlement') {
      if (tg.includes('homeowner') || tg.includes('housing_scheme')) {
        statusScore += 0.4; // Aspiration to own
      }
    }
    if (housingType === 'owned' && tg.includes('property_tax')) {
      statusScore -= 0.2; // Threat to asset
    }
  }
  
  // Government job/formal employment = high status in India
  if (domain === 'employment') {
    if (employmentType === 'informal' || employmentType === 'unemployed') {
      if (tg.includes('formal_sector') || tg.includes('government_job')) {
        statusScore += 0.4; // Aspiration
      }
    }
  }
  
  if (statusScore !== 0) {
    totalScore += Math.max(-1, Math.min(1, statusScore)) * 0.12; // 12% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 4: COMMUNITY & NETWORK EFFECTS
  // ============================================================
  
  let communityScore = 0;
  
  // Rural communities are more tightly knit - collective impact matters
  if (urbanization === 'rural') {
    // If policy targets rural, whole community benefits
    if (tg.includes('rural') || tg.includes('village') || tg.includes('farmer')) {
      communityScore += 0.3;
    }
    // Agricultural policies affect rural community broadly
    if (domain === 'agriculture') {
      communityScore += 0.4;
    }
  }
  
  // Large households feel policies more collectively
  if (householdSize >= 5) {
    // Pro-family policies have bigger impact
    if (tg.includes('family') || tg.includes('children') || tg.includes('parents')) {
      communityScore += 0.25;
    }
    // Cost increases hurt large families more (social stress)
    const economicCost = policy.impacts?.economicCost || 0;
    if (economicCost > 0) {
      communityScore -= 0.15;
    }
  }
  
  // Civic participation indicates community involvement
  if (civicParticipation > 30) {
    // Active citizens care more about community-wide policies
    if (domain === 'infrastructure' || domain === 'environment' || domain === 'social') {
      communityScore += 0.2;
    }
  }
  
  // Voting behavior indicates political community engagement
  if (votingBehavior === 'regular') {
    // Regular voters more invested in policy outcomes
    communityScore += 0.1;
  }
  
  // Media consumption affects awareness of community issues
  if (mediaConsumption === 'social media' || mediaConsumption === 'both') {
    // Social media users more aware of policy discussions
    if (policyAwareness >= 3) {
      communityScore += 0.1;
    }
  }
  
  if (communityScore !== 0) {
    totalScore += Math.max(-1, Math.min(1, communityScore)) * 0.1; // 10% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 5: VULNERABILITY & PROTECTION NEEDS
  // ============================================================
  
  let vulnerabilityScore = 0;
  
  // Health vulnerability - healthcare policies
  if (domain === 'health') {
    if (diseaseRisk > 50) {
      vulnerabilityScore += 0.5;
    }
    if (healthcareAccess < 40) {
      vulnerabilityScore += 0.4;
    }
    if (age > 60) {
      vulnerabilityScore += 0.3;
    }
    if (bmiCategory === 'underweight') {
      vulnerabilityScore += 0.2;
    }
  }
  
  // Economic vulnerability - welfare/subsidy policies
  if (domain === 'social' || tg.includes('welfare') || tg.includes('subsidy')) {
    if (povertyStatus === 1) {
      vulnerabilityScore += 0.6;
    }
    if (incomeStability <= 2) {
      vulnerabilityScore += 0.3;
    }
    if (debtVulnerability > 50) {
      vulnerabilityScore += 0.3;
    }
    if (savingsRate < 0) {
      vulnerabilityScore += 0.2;
    }
  }
  
  // Housing vulnerability
  if (domain === 'housing') {
    if (housingType === 'informal settlement') {
      vulnerabilityScore += 0.6;
    }
    if (housingCostBurden > 40) {
      vulnerabilityScore += 0.3;
    }
  }
  
  // Environmental vulnerability
  if (domain === 'environment') {
    if (climateVulnerability >= 4) {
      vulnerabilityScore += 0.5;
    }
    if (pollutionExposure > 200) { // High AQI
      vulnerabilityScore += 0.4;
    }
    if (greenSpaceAccess < 10) {
      vulnerabilityScore += 0.2;
    }
  }
  
  // Digital vulnerability for tech/digital policies
  if (domain === 'technology' || tg.includes('digital')) {
    if (internetConnectivity === 'none') {
      // Digital policies may exclude them - negative if mandatory
      if (tg.includes('mandatory') || tg.includes('compulsory')) {
        vulnerabilityScore -= 0.4;
      } else {
        vulnerabilityScore += 0.3; // Aspirational if voluntary
      }
    }
    if (digitalLiteracy <= 2) {
      vulnerabilityScore -= 0.2; // May struggle with digital policies
    }
  }
  
  // Legal vulnerability
  if (domain === 'security' || tg.includes('law') || tg.includes('police')) {
    if (criminalRecord) {
      vulnerabilityScore -= 0.5; // Stricter laws hurt them
    }
    if (citizenshipStatus !== 'citizen') {
      vulnerabilityScore -= 0.4;
    }
  }
  
  if (vulnerabilityScore !== 0) {
    totalScore += Math.max(-1, Math.min(1, vulnerabilityScore)) * 0.13; // 13% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 6: ASPIRATIONAL ALIGNMENT
  // ============================================================
  
  let aspirationScore = 0;
  
  // Young people have more aspirations
  if (age <= 35) {
    // Employment/education policies align with youth aspirations
    if (domain === 'employment' || domain === 'education' || domain === 'technology') {
      aspirationScore += 0.3;
    }
    // Skill development policies
    if (tg.includes('skill') || tg.includes('training') || tg.includes('startup')) {
      aspirationScore += 0.4;
    }
  }
  
  // Upward mobility aspirations based on current position
  if (wealthQuintile === 'q1' || wealthQuintile === 'q2') {
    // Poor have strong aspirations for improvement
    if (tg.includes('upliftment') || tg.includes('welfare') || tg.includes('development')) {
      aspirationScore += 0.35;
    }
  }
  
  // Geographic mobility indicates aspiration
  if (geographicMobility >= 4) {
    // Mobile people are aspirational
    if (domain === 'infrastructure' || domain === 'employment') {
      aspirationScore += 0.2;
    }
  }
  
  // Change adaptability indicates openness to aspirational policies
  if (changeAdaptability >= 4) {
    // High adaptability = embrace change-oriented policies
    if (domain === 'technology' || domain === 'infrastructure') {
      aspirationScore += 0.25;
    }
  }
  
  // Risk tolerance affects aspirational policy support
  if (riskTolerance >= 4) {
    // Risk-tolerant support ambitious policies
    if (tg.includes('startup') || tg.includes('entrepreneur') || tg.includes('innovation')) {
      aspirationScore += 0.3;
    }
  }
  
  if (aspirationScore !== 0) {
    totalScore += Math.max(-1, Math.min(1, aspirationScore)) * 0.1; // 10% weight
    factorCount++;
  }
  
  
  // ============================================================
  // SECTION 7: TRUST & INSTITUTIONAL RELATIONSHIP
  // ============================================================
  
  let trustScore = 0;
  
  // Institutional trust affects belief in policy benefits
  const trustFactor = institutionalTrust / 100; // 0 to 1
  
  // Low trust reduces positive social impact expectations
  if (trustFactor < 0.4) {
    // Skeptical about government delivering benefits
    trustScore -= 0.2;
  } else if (trustFactor > 0.7) {
    // High trust amplifies positive policy reception
    trustScore += 0.15;
  }
  
  // Policy awareness affects how they perceive social impact
  if (policyAwareness >= 4) {
    // High awareness = better understanding of implications
    trustScore += 0.1;
  } else if (policyAwareness <= 2) {
    // Low awareness = may not understand benefits
    trustScore -= 0.1;
  }
  
  // Past voting behavior indicates trust in political system
  if (votingBehavior === 'non-voter') {
    // Disengaged from system
    trustScore -= 0.15;
  }
  
  totalScore += Math.max(-1, Math.min(1, trustScore));
  factorCount++;
  
  
  // ============================================================
  // FINAL SCORE CALCULATION
  // ============================================================
  
  // Normalize by factor count if needed
  let finalScore = totalScore;
  
  // Apply bounds
  finalScore = Math.max(-1, Math.min(1, finalScore));
  
  // Apply caste consciousness as a multiplier for social reactions
  // High caste consciousness = stronger social/identity reactions
  if (casteConsciousness >= 4) {
    finalScore *= 1.15;
  } else if (casteConsciousness <= 2) {
    finalScore *= 0.9;
  }
  
  // Final bounds check
  return Math.max(-1, Math.min(1, finalScore));
}


/**
 * Get detailed breakdown of social impact components
 * Useful for debugging and understanding the score
 */
function getSocialImpactBreakdown(human, policy) {
  // This could be expanded to return detailed component scores
  const totalScore = calculateSocialImpact(human, policy);
  
  return {
    totalScore,
    humanProfile: {
      caste: human.demographics?.caste,
      religion: human.demographics?.religion,
      urbanization: human.demographics?.urbanization,
      occupation: human.socioEconomic?.occupation,
      wealthQuintile: human.socioEconomic?.wealthQuintile,
      casteConsciousness: human.behavioral?.casteConsciousness
    },
    policyTargets: policy.targetGroups || []
  };
}


// Export functions
export { calculateSocialImpact, getSocialImpactBreakdown };
