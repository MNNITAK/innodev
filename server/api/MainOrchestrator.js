/**
 * MAIN ORCHESTRATOR
 * Central controller that manages the entire opinion collection workflow
 * Accepts population & policy, distributes humans, processes through brain, stores opinions
 */


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import NationalPopulationDistributorController from './NationalPopulationDistributorController.js';
import { calculateHumanOpinion, parsePolicy } from '../human_brain/cognitiveModel.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MainOrchestrator {
  /**
   * Main orchestration function - single entry point
   * @param {number} totalPopulation - Total humans to generate for India
   * @param {string|object} policy - Policy (string for NLP, object for structured)
   * @returns {Promise<Object>} - Complete workflow results
   */
  static async orchestrate(totalPopulation = 1000, policy) {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 MAIN ORCHESTRATOR - POLICY OPINION COLLECTION WORKFLOW');
    console.log('='.repeat(80));
    console.log(`📊 Population: ${totalPopulation}`);
    console.log(`📋 Policy: ${typeof policy === 'string' ? policy.substring(0, 50) + '...' : policy.title || 'Unknown'}`);
    console.log(`⏰ Started: ${new Date().toISOString()}\n`);

    const startTime = Date.now();

    try {
      // STEP 1: Distribute population across states
      console.log('\n📍 STEP 1: DISTRIBUTING POPULATION ACROSS STATES');
      console.log('-'.repeat(80));
      const distributionResult = await NationalPopulationDistributorController.distributeAndGeneratePopulation(totalPopulation);

      if (!distributionResult.success) {
        throw new Error(`Distribution failed. Failed states: ${distributionResult.statesFailed}`);
      }

      const humanDataDir = path.join(__dirname, '../human_data');

      // STEP 1.5: Parse policy ONCE (before processing any humans)
      console.log('\n📋 STEP 1.5: PARSING POLICY');
      console.log('-'.repeat(80));
      const parsedPolicy = await parsePolicy(policy);
      console.log(`✅ Policy parsed: "${parsedPolicy.title}" (${parsedPolicy.domain})`);
      console.log(`   Confidence: ${parsedPolicy.confidence}, Data Quality: ${parsedPolicy.dataQuality}\n`);

      // STEP 2: Process humans through cognitive model
      console.log('\n🧠 STEP 2: PROCESSING HUMANS THROUGH COGNITIVE MODEL');
      console.log('-'.repeat(80));

      const opinionsByState = {};
      const allOpinions = [];

      // Get list of state folders
      const states = fs.readdirSync(humanDataDir).filter(file => {
        const filePath = path.join(humanDataDir, file);
        return fs.statSync(filePath).isDirectory();
      });

      for (const state of states) {
        const stateHumanDir = path.join(humanDataDir, state);
        const humanOpinionDir = path.join(__dirname, '../human_opinion_data', state);

        // Create opinion directory if it doesn't exist
        if (!fs.existsSync(humanOpinionDir)) {
          fs.mkdirSync(humanOpinionDir, { recursive: true });
        }

        console.log(`\n  Processing ${state}...`);

        // Read humans.json file which contains array of all humans
        const humansFilePath = path.join(stateHumanDir, 'humans.json');
        
        if (!fs.existsSync(humansFilePath)) {
          console.log(`  ⚠️ ${state}: No humans.json found, skipping...`);
          continue;
        }

        const humansArray = JSON.parse(fs.readFileSync(humansFilePath, 'utf8'));
        
        if (!Array.isArray(humansArray)) {
          console.log(`  ⚠️ ${state}: humans.json is not an array, skipping...`);
          continue;
        }

        const stateOpinions = [];
        let processedCount = 0;
        let errorCount = 0;

        // Process each human in the array
        for (const humanData of humansArray) {
          try {
            // Calculate opinion through cognitive model with pre-parsed policy
            const opinion = await calculateHumanOpinion(humanData, parsedPolicy);

            // Add human ID and state to opinion
            opinion.humanId = humanData.humanId || humanData.id;
            opinion.state = state;

            // Store opinion
            stateOpinions.push(opinion);
            allOpinions.push(opinion);

            // Save individual opinion file
            const humanIdForFile = humanData.humanId || humanData.id || `human_${processedCount}`;
            const opinionFileName = `${humanIdForFile}_opinion.json`;
            const opinionPath = path.join(humanOpinionDir, opinionFileName);
            fs.writeFileSync(opinionPath, JSON.stringify(opinion, null, 2), 'utf8');

            processedCount++;

            // Progress indicator (every 10% or every 10 humans, whichever is more frequent)
            const progressStep = Math.max(1, Math.floor(humansArray.length / 10));
            if (processedCount % progressStep === 0) {
              process.stdout.write('.');
            }

          } catch (error) {
            errorCount++;
            console.error(`\n    ❌ Error processing human ${humanData?.humanId || humanData?.id || processedCount}: ${error.message}`);
          }
        }

        opinionsByState[state] = stateOpinions;

        console.log(`\n  ✅ ${state}: ${processedCount} processed, ${errorCount} errors`);
      }

      // STEP 3: Store aggregated state results
      console.log('\n\n💾 STEP 3: STORING AGGREGATED RESULTS');
      console.log('-'.repeat(80));

      for (const [state, opinions] of Object.entries(opinionsByState)) {
        const humanOpinionDir = path.join(__dirname, '../human_opinion_data', state);
        const stateSummaryPath = path.join(humanOpinionDir, '_state_summary.json');

        const summary = this.calculateStateSummary(opinions, policy);
        fs.writeFileSync(stateSummaryPath, JSON.stringify(summary, null, 2), 'utf8');

        console.log(`  ✅ ${state}: Summary saved (${opinions.length} opinions)`);
      }

      // STEP 4: Calculate national summary
      console.log('\n\n🏛️ STEP 4: GENERATING NATIONAL SUMMARY');
      console.log('-'.repeat(80));

      const nationalSummary = this.calculateNationalSummary(allOpinions, policy);
      const nationalSummaryPath = path.join(__dirname, '../human_opinion_data/_national_summary.json');
      fs.writeFileSync(nationalSummaryPath, JSON.stringify(nationalSummary, null, 2), 'utf8');

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      // FINAL REPORT
      console.log('\n' + '='.repeat(80));
      console.log('✅ ORCHESTRATION COMPLETE');
      console.log('='.repeat(80));
      console.log(`\n📊 RESULTS SUMMARY:`);
      console.log(`  Total Humans Processed: ${allOpinions.length}`);
      console.log(`  States Processed: ${Object.keys(opinionsByState).length}`);
      console.log(`  Policy: ${nationalSummary.policy}`);
      console.log(`  National Verdict: ${nationalSummary.executiveSummary.verdict}`);
      console.log(`  Support: ${nationalSummary.executiveSummary.support.percentage}`);
      console.log(`  Oppose: ${nationalSummary.executiveSummary.oppose.percentage}`);
      console.log(`  Duration: ${duration} seconds`);
      console.log(`\n📁 Opinion Data Saved to: ${path.join(__dirname, '../human_opinion_data')}`);
      console.log(`📁 National Summary: ${nationalSummaryPath}`);
      console.log('\n' + '='.repeat(80) + '\n');

      return {
        success: true,
        totalPopulation,
        humanProcessed: allOpinions.length,
        statesProcessed: Object.keys(opinionsByState).length,
        opinionsByState,
        nationalSummary,
        opinionDataPath: path.join(__dirname, '../human_opinion_data'),
        duration: `${duration}s`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('\n\n❌ ORCHESTRATION FAILED');
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate summary statistics for a state
   */
  static calculateStateSummary(opinions, policy) {
    const opinionValues = opinions.map(o => parseFloat(o.opinion));
    const confidences = opinions.map(o => parseFloat(o.confidence));

    const support = opinions.filter(o => o.decision === 'SUPPORT').length;
    const oppose = opinions.filter(o => o.decision === 'OPPOSE').length;
    const neutral = opinions.filter(o => o.decision === 'NEUTRAL').length;

    return {
      stateOpiionCount: opinions.length,
      support: support,
      oppose: oppose,
      neutral: neutral,
      averageOpinion: (opinionValues.reduce((a, b) => a + b, 0) / opinions.length).toFixed(3),
      averageConfidence: (confidences.reduce((a, b) => a + b, 0) / opinions.length).toFixed(3),
      stdDev: this.calculateStdDev(opinionValues).toFixed(3)
    };
  }

  /**
   * Calculate national summary - comprehensive analysis
   */
  static calculateNationalSummary(allOpinions, policy) {
    const opinionValues = allOpinions.map(o => parseFloat(o.opinion));
    const confidences = allOpinions.map(o => parseFloat(o.confidence));

    const support = allOpinions.filter(o => o.decision === 'SUPPORT').length;
    const oppose = allOpinions.filter(o => o.decision === 'OPPOSE').length;
    const neutral = allOpinions.filter(o => o.decision === 'NEUTRAL').length;
    const total = allOpinions.length;

    const avgOpinion = opinionValues.reduce((a, b) => a + b, 0) / total;
    const stdDev = this.calculateStdDev(opinionValues);

    // Determine verdict
    const supportPct = (support / total) * 100;
    const opposePct = (oppose / total) * 100;
    let verdict = 'NEUTRAL';
    if (supportPct > opposePct + 5) verdict = 'MAJORITY SUPPORT';
    else if (opposePct > supportPct + 5) verdict = 'MAJORITY OPPOSE';

    // Polarization metrics
    const extremism = allOpinions.filter(o => Math.abs(parseFloat(o.opinion)) > 0.7).length / total * 100;
    const polarizationIndex = stdDev * (Math.abs(avgOpinion) + 1);

    // Group by demographics
    const byIncome = this.groupByIncome(allOpinions);

    // Identify vulnerable groups
    const vulnerableGroupsHarmed = allOpinions.filter(o => {
      const income = o.metadata?.income || 0;
      const decision = o.decision;
      return income < 5000 && decision === 'OPPOSE';
    }).length;

    // Generate recommendations
    const recommendations = this.generateRecommendations(verdict, supportPct, extremism);

    return {
      policy: typeof policy === 'string' ? policy.substring(0, 100) : policy.title || 'Unknown',
      executiveSummary: {
        totalPopulation: total,
        support: {
          count: support,
          percentage: ((support / total) * 100).toFixed(1) + '%'
        },
        oppose: {
          count: oppose,
          percentage: ((oppose / total) * 100).toFixed(1) + '%'
        },
        neutral: {
          count: neutral,
          percentage: ((neutral / total) * 100).toFixed(1) + '%'
        },
        averageOpinion: avgOpinion.toFixed(3),
        averageConfidence: (confidences.reduce((a, b) => a + b, 0) / total).toFixed(3),
        verdict: verdict
      },
      polarization: {
        standardDeviation: stdDev.toFixed(3),
        polarizationIndex: polarizationIndex.toFixed(3),
        extremismRate: extremism.toFixed(1) + '%',
        interpretation: this.interpretPolarization(stdDev)
      },
      demographics: {
        byIncome: byIncome
      },
      impact: {
        vulnerableGroupsHarmed: {
          count: vulnerableGroupsHarmed,
          percentage: ((vulnerableGroupsHarmed / total) * 100).toFixed(1) + '%'
        }
      },
      recommendations: recommendations,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Group opinions by income level
   */
  static groupByIncome(opinions) {
    const incomeGroups = {
      'Poor': [],
      'Lower Middle Class': [],
      'Middle Class': [],
      'Upper Middle Class': [],
      'Rich': []
    };

    opinions.forEach(o => {
      // Extract income from opinion if available
      const income = o.breakdown?.economicData?.income || 0;
      let group = 'Middle Class';

      if (income < 2000) group = 'Poor';
      else if (income < 5000) group = 'Lower Middle Class';
      else if (income < 15000) group = 'Upper Middle Class';
      else group = 'Rich';

      incomeGroups[group].push(o);
    });

    const result = {};
    for (const [group, ops] of Object.entries(incomeGroups)) {
      if (ops.length > 0) {
        const opinionVals = ops.map(o => parseFloat(o.opinion));
        const support = ops.filter(o => o.decision === 'SUPPORT').length;
        const oppose = ops.filter(o => o.decision === 'OPPOSE').length;

        result[group] = {
          count: ops.length,
          avgOpinion: (opinionVals.reduce((a, b) => a + b, 0) / ops.length).toFixed(3),
          supportPct: ((support / ops.length) * 100).toFixed(1) + '%',
          opposePct: ((oppose / ops.length) * 100).toFixed(1) + '%'
        };
      }
    }

    return result;
  }

  /**
   * Interpret polarization level
   */
  static interpretPolarization(stdDev) {
    if (stdDev < 0.3) return 'LOW POLARIZATION - Consensus';
    if (stdDev < 0.5) return 'MODERATE DIVISION - Some disagreement';
    if (stdDev < 0.7) return 'HIGH POLARIZATION - Significant split';
    return 'EXTREME POLARIZATION - Deeply divided';
  }

  /**
   * Generate policy recommendations
   */
  static generateRecommendations(verdict, supportPct, extremism) {
    const recommendations = [];

    if (verdict === 'MAJORITY OPPOSE') {
      recommendations.push({
        type: 'POLITICAL_RISK',
        severity: 'HIGH',
        message: 'Majority opposition detected. Consider policy revision or enhanced communication.'
      });
    }

    if (extremism > 30) {
      recommendations.push({
        type: 'POLARIZATION',
        severity: 'HIGH',
        message: 'Policy has created deep divisions. Risk of social conflict.'
      });
    }

    if (supportPct > 70) {
      recommendations.push({
        type: 'IMPLEMENTATION',
        severity: 'LOW',
        message: 'Strong public support. Proceed with implementation.'
      });
    }

    if (extremism < 10 && supportPct > 45) {
      recommendations.push({
        type: 'COMMUNICATION',
        severity: 'LOW',
        message: 'Low polarization with reasonable support. Enhance awareness campaigns.'
      });
    }

    return recommendations.length > 0 ? recommendations : [
      {
        type: 'MONITORING',
        severity: 'MEDIUM',
        message: 'Continue monitoring public opinion before final implementation.'
      }
    ];
  }

  /**
   * Helper: Calculate standard deviation
   */
  static calculateStdDev(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }
}

export default MainOrchestrator;
