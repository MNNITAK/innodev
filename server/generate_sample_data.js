#!/usr/bin/env node

/**
 * SAMPLE DATA GENERATOR
 * 
 * Generates realistic sample data for 1000 humans distributed across Indian states
 * Usage:
 *   node generate_sample_data.js
 * 
 * This will create sample humans distributed realistically across Indian states,
 * with diverse demographics, socio-economic profiles, and behavioral traits.
 */

import fs from 'fs';
import path from 'path';

const STATES = [
  'UP', 'Maharashtra', 'Bihar', 'WB', 'Rajasthan', 'Madhya Pradesh',
  'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Assam', 'Punjab',
  'Kerala', 'Odissa', 'Haryana', 'Jharkhand', 'Himachal', 'Uttrakhand',
  'Goa', 'Manipur', 'Mizoram', 'Nagaland', 'Arunachal', 'Jammu_kashmir', 'AndamanNicobar'
];

const STATE_POPULATION_RATIOS = {
  'UP': 0.16, 'Maharashtra': 0.10, 'Bihar': 0.08, 'WB': 0.07, 'Rajasthan': 0.06,
  'Madhya Pradesh': 0.06, 'Delhi': 0.02, 'Karnataka': 0.05, 'Gujarat': 0.05, 'Tamil Nadu': 0.05,
  'Assam': 0.03, 'Punjab': 0.02, 'Kerala': 0.03, 'Odissa': 0.03, 'Haryana': 0.02,
  'Jharkhand': 0.03, 'Himachal': 0.01, 'Uttrakhand': 0.01, 'Goa': 0.01, 'Manipur': 0.01,
  'Mizoram': 0.01, 'Nagaland': 0.01, 'Arunachal': 0.01, 'Jammu_kashmir': 0.01, 'AndamanNicobar': 0.01
};

const DISTRICTS_BY_STATE = {
  'UP': ['Agra', 'Varanasi', 'Lucknow', 'Kanpur', 'Allahabad', 'Mathura', 'Ghaziabad'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Darbhanga'],
  'WB': ['Kolkata', 'Darjeeling', 'Malda', 'Hooghly'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Kota'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Belgaum'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Chandigarh'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
  'Odissa': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Hisar'],
  'Jharkhand': ['Ranchi', 'Dhanbad', 'Jamshedpur'],
  'Himachal': ['Shimla', 'Solan'],
  'Uttrakhand': ['Dehradun', 'Nainital'],
  'Goa': ['Panaji', 'Margao'],
  'Manipur': ['Imphal'],
  'Mizoram': ['Aizawl'],
  'Nagaland': ['Kohima'],
  'Arunachal': ['Itanagar'],
  'Jammu_kashmir': ['Srinagar', 'Jammu'],
  'AndamanNicobar': ['Port Blair']
};

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
const CASTES = ['General', 'OBC', 'SC', 'ST'];
const OCCUPATIONS = ['Agriculture', 'Manufacturing', 'Services', 'Business', 'Retail', 'Education', 'Healthcare', 'Government', 'Unemployed'];
const EMPLOYMENT_TYPES = ['Formal', 'Informal', 'Self-employed', 'Unemployed'];
const URBANIZATION = ['Urban', 'Semi-Urban', 'Rural'];
const HOUSING_TYPES = ['Owned', 'Rented', 'Joint family'];
const WEALTH_QUINTILES = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateDemographics() {
  const age = getRandomInt(18, 85);
  const sex = Math.random() > 0.5 ? 'Male' : 'Female';
  const householdSize = getRandomInt(1, 8);
  
  return {
    age,
    householdSize,
    sex,
    urbanization: getRandomElement(URBANIZATION),
    religion: getRandomElement(RELIGIONS),
    caste: getRandomElement(CASTES),
    tribalConcentration: getRandomInt(0, 2)
  };
}

function generateSocioEconomic() {
  const wealthQuintile = getRandomElement(WEALTH_QUINTILES);
  const incomePerCapita = {
    'Q1': getRandomInt(2000, 4000),
    'Q2': getRandomInt(4000, 7000),
    'Q3': getRandomInt(7000, 12000),
    'Q4': getRandomInt(12000, 20000),
    'Q5': getRandomInt(20000, 50000)
  }[wealthQuintile];

  const literacy = Math.random() > 0.3 ? 1 : 0;
  
  return {
    incomePerCapita,
    povertyStatus: Math.random() > 0.7 ? 1 : 0,
    literacy,
    educationLevel: getRandomInt(0, 5),
    occupation: getRandomElement(OCCUPATIONS),
    employmentType: getRandomElement(EMPLOYMENT_TYPES),
    wealthQuintile
  };
}

function generateBehavioral() {
  return {
    casteConsciousness: getRandomInt(1, 5),
    riskTolerance: getRandomInt(1, 5),
    institutionalTrust: getRandomInt(20, 80),
    changeAdaptability: getRandomInt(1, 5),
    optimism: getRandomInt(1, 5)
  };
}

function generateHealth() {
  const bmi = getRandomFloat(18, 35, 1);
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return {
    healthcareAccess: getRandomInt(30, 90),
    healthLiteracy: getRandomInt(1, 5),
    nutritionalStatus: {
      bmi,
      category
    },
    diseaseRisk: getRandomInt(20, 70)
  };
}

function generateEconomicStability() {
  return {
    incomeStability: getRandomInt(1, 5),
    debtVulnerability: getRandomInt(10, 80),
    savingsRate: getRandomInt(-50, 50)
  };
}

function generateHousing() {
  return {
    housingType: getRandomElement(HOUSING_TYPES),
    housingCostBurden: getRandomInt(15, 60)
  };
}

function generateMobility() {
  return {
    hasVehicle: Math.random() > 0.6 ? 1 : 0,
    transportationCost: getRandomInt(500, 5000),
    commuteTime: getRandomInt(10, 120)
  };
}

function generatePoliticalProfile() {
  return {
    politicalEngagement: getRandomInt(1, 5),
    voteHistory: Math.random() > 0.3 ? 1 : 0,
    partyAffinity: getRandomElement(['BJP', 'Congress', 'TMC', 'DMK', 'AIADMK', 'AAP', 'Neutral', 'None']),
    policyInterest: getRandomInt(1, 5)
  };
}

function generateSocialContext() {
  return {
    familyInfluence: getRandomInt(1, 5),
    peerInfluence: getRandomInt(1, 5),
    communityEngagement: getRandomInt(1, 5),
    onlinePresence: getRandomInt(0, 5)
  };
}

function generateHuman(stateIdx, humanIdx, state) {
  const district = getRandomElement(DISTRICTS_BY_STATE[state] || [state]);
  const humanId = `HUM_${state}_${district}_${humanIdx}`;
  const householdId = `HH_${state}_${district}_${Math.floor(humanIdx / 5)}`;

  return {
    humanId,
    householdId,
    state,
    district,
    demographics: generateDemographics(),
    socioEconomic: generateSocioEconomic(),
    behavioral: generateBehavioral(),
    health: generateHealth(),
    economicStability: generateEconomicStability(),
    housing: generateHousing(),
    mobility: generateMobility(),
    politicalProfile: generatePoliticalProfile(),
    socialContext: generateSocialContext()
  };
}

function generateSampleData(totalPopulation = 1000) {
  console.log('\n🎯 GENERATING SAMPLE DATA FOR 1000 HUMANS\n');
  console.log(`📊 Total Population: ${totalPopulation}`);
  console.log(`🌏 States: ${STATES.length}`);
  
  const sampleDir = './sample_data';
  
  // Create sample_data directory if it doesn't exist
  if (!fs.existsSync(sampleDir)) {
    fs.mkdirSync(sampleDir, { recursive: true });
    console.log(`\n✅ Created directory: ${sampleDir}`);
  }

  const allHumans = [];
  const stateData = {};

  // Generate humans distributed by state population ratios
  let humanCounter = 0;
  
  STATES.forEach((state, stateIdx) => {
    const statePopulation = Math.round(totalPopulation * (STATE_POPULATION_RATIOS[state] || 0.01));
    const humans = [];

    console.log(`\n📍 ${state}: ${statePopulation} humans`);

    for (let i = 0; i < statePopulation; i++) {
      const human = generateHuman(stateIdx, i, state);
      humans.push(human);
      allHumans.push(human);
      humanCounter++;
    }

    stateData[state] = {
      state,
      populationCount: statePopulation,
      humans
    };
  });

  // Save individual state data
  Object.entries(stateData).forEach(([state, data]) => {
    const stateDir = path.join(sampleDir, state);
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }

    // Save humans.json
    fs.writeFileSync(
      path.join(stateDir, 'humans.json'),
      JSON.stringify(data.humans, null, 2)
    );

    // Save metadata
    fs.writeFileSync(
      path.join(stateDir, 'metadata.json'),
      JSON.stringify({
        state,
        populationCount: data.populationCount,
        generatedAt: new Date().toISOString(),
        dataVersion: '1.0'
      }, null, 2)
    );
  });

  // Save comprehensive summary
  fs.writeFileSync(
    path.join(sampleDir, '_all_humans.json'),
    JSON.stringify(allHumans, null, 2)
  );

  // Save summary statistics
  const summary = {
    totalPopulation: allHumans.length,
    stateBreakdown: Object.entries(stateData).map(([state, data]) => ({
      state,
      count: data.populationCount
    })),
    demographicsSummary: {
      ageRange: {
        min: 18,
        max: 85
      },
      genderRatio: {
        male: allHumans.filter(h => h.demographics.sex === 'Male').length,
        female: allHumans.filter(h => h.demographics.sex === 'Female').length
      },
      urbanization: {
        urban: allHumans.filter(h => h.demographics.urbanization === 'Urban').length,
        semiUrban: allHumans.filter(h => h.demographics.urbanization === 'Semi-Urban').length,
        rural: allHumans.filter(h => h.demographics.urbanization === 'Rural').length
      }
    },
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(sampleDir, '_summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log('✅ SAMPLE DATA GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`\n📁 Sample Data Location: ${sampleDir}`);
  console.log(`📊 Total Humans Generated: ${allHumans.length}`);
  console.log(`🌍 States Covered: ${STATES.length}`);
  console.log(`\n📝 Files Created:`);
  console.log(`   • sample_data/_all_humans.json (complete dataset)`);
  console.log(`   • sample_data/_summary.json (statistics)`);
  console.log(`   • sample_data/{state}/humans.json (state-wise data)`);
  console.log(`   • sample_data/{state}/metadata.json (state metadata)`);
  console.log('\n💡 Next Steps:');
  console.log('   To use this data with run_orchestrator:');
  console.log('   1. Copy state directories to human_data/');
  console.log('   2. Run: node run_orchestrator.js 1000 "Your Policy Question"');
  console.log('\n');
}

// Run the generator
generateSampleData(1000);
