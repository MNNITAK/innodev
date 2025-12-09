/**
 * DECISION RESEARCH ENGINE
 * Analyzes public opinion data and provides strategic insights
 * Extracts data from human_opinion_data and generates research reports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatGroq } from '@langchain/groq';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DecisionResearchEngine {
  /**
   * Main research function - analyzes opinion data from all states
   * @param {string} policyName - Policy to analyze (optional filter)
   * @returns {Promise<Object>} - Comprehensive research report
   */
  static async analyzePublicOpinion(policyName = null) {
    console.log('\n' + '='.repeat(80));
    console.log('🔬 DECISION RESEARCH ENGINE - PUBLIC OPINION ANALYSIS');
    console.log('='.repeat(80));
    console.log(`⏰ Analysis Started: ${new Date().toISOString()}\n`);

    try {
      const opinionDataPath = path.join(__dirname, '../human_opinion_data');

      // Check if national summary exists
      const nationalSummaryPath = path.join(opinionDataPath, '_national_summary.json');
      if (fs.existsSync(nationalSummaryPath)) {
        console.log('📁 Found national summary data\n');
        const nationalSummary = JSON.parse(fs.readFileSync(nationalSummaryPath, 'utf8'));
        return this.enrichAndPresent(nationalSummary);
      }

      // If no national summary, aggregate from state data
      console.log('📁 Aggregating opinion data from state folders...\n');
      const allOpinions = this.extractOpinionsFromStates(opinionDataPath);

      if (allOpinions.length === 0) {
        throw new Error('No opinion data found. Run MainOrchestrator first.');
      }

      // Generate research report
      const report = this.generateResearchReport(allOpinions, policyName);
      
      // Generate LLM-powered conclusion with 80-85% relevance targeting
      console.log('\n🤖 Generating LLM-powered conclusion...\n');
      const llmConclusion = await this.generateLLMConclusion(report, policyName);
      report.llmConclusion = llmConclusion;
      
      // Display results
      this.displayResearchReport(report);

      return report;

    } catch (error) {
      console.error('\n\n❌ RESEARCH ANALYSIS FAILED');
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract opinion files from all state directories
   */
  static extractOpinionsFromStates(opinionDataPath) {
    const allOpinions = [];

    if (!fs.existsSync(opinionDataPath)) {
      console.warn('⚠️  Opinion data directory not found');
      return allOpinions;
    }

    const states = fs.readdirSync(opinionDataPath).filter(file => {
      const filePath = path.join(opinionDataPath, file);
      return fs.statSync(filePath).isDirectory();
    });

    for (const state of states) {
      const stateDir = path.join(opinionDataPath, state);
      const opinionFiles = fs.readdirSync(stateDir)
        .filter(f => f.endsWith('_opinion.json'));

      console.log(`  📍 ${state}: ${opinionFiles.length} opinions`);

      for (const file of opinionFiles) {
        try {
          const filePath = path.join(stateDir, file);
          const opinion = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          allOpinions.push(opinion);
        } catch (error) {
          console.error(`    ⚠️  Failed to read ${file}: ${error.message}`);
        }
      }
    }

    console.log(`\n  Total Opinions Loaded: ${allOpinions.length}\n`);
    return allOpinions;
  }

  /**
   * Generate comprehensive research report
   */
  static generateResearchReport(opinions, policyName) {
    const opinionValues = opinions.map(o => parseFloat(o.opinion));
    const confidences = opinions.map(o => parseFloat(o.confidence));

    const avgOpinion = opinionValues.reduce((a, b) => a + b, 0) / opinionValues.length;
    const stdDev = this.calculateStdDev(opinionValues);

    // Calculate support/oppose/neutral based on actual opinion values
    // Using a threshold approach: strong support >0.15, strong oppose <-0.15, neutral in between
    // This is more accurate than relying on the decision field which may have inconsistencies
     const support = opinionValues.filter(v => v > 0.1). length;  // Changed from 0.15
  const oppose = opinionValues. filter(v => v < -0.1).length;  // Changed from -0.15
  const neutral = opinionValues.filter(v => v >= -0.1 && v <= 0.1).length;
    const total = opinions.length;

    const supportPct = (support / total) * 100;
    const opposePct = (oppose / total) * 100;

    // Determine verdict
    let verdict = 'NEUTRAL';
    if (supportPct > opposePct + 5) verdict = 'MAJORITY SUPPORT';
    else if (opposePct > supportPct + 5) verdict = 'MAJORITY OPPOSE';

    // Advanced metrics
    const polarizationIndex = stdDev * (Math.abs(avgOpinion) + 1);
    const extremism = opinions.filter(o => Math.abs(parseFloat(o.opinion)) > 0.7).length / total * 100;
    const consensus = 100 - extremism;

    // Demographics analysis
    const byState = this.analyzeByState(opinions);
    const byDemographic = this.analyzeByDemographic(opinions);
    const vulnerabilityAnalysis = this.analyzeVulnerability(opinions);

    // Risk assessment
    const riskFactors = this.assessRisks(verdict, supportPct, extremism, stdDev);

    // Confidence intervals
    const confidenceInterval = this.calculateConfidenceInterval(opinionValues);

    return {
      metadata: {
        analysisDate: new Date().toISOString(),
        totalRespondents: total,
        policyAnalyzed: policyName || 'Policy Opinion Analysis',
        confidenceLevel: '95%'
      },
      executiveSummary: {
        totalPopulation: total,
        support: {
          count: support,
          percentage: supportPct.toFixed(1) + '%'
        },
        oppose: {
          count: oppose,
          percentage: opposePct.toFixed(1) + '%'
        },
        neutral: {
          count: neutral,
          percentage: ((neutral / total) * 100).toFixed(1) + '%'
        },
        averageOpinion: avgOpinion.toFixed(3),
        averageConfidence: (confidences.reduce((a, b) => a + b, 0) / total).toFixed(3),
        verdict: verdict
      },
      statisticalAnalysis: {
        standardDeviation: stdDev.toFixed(3),
        variance: (stdDev * stdDev).toFixed(3),
        polarizationIndex: polarizationIndex.toFixed(3),
        consensus: consensus.toFixed(1) + '%',
        extremismRate: extremism.toFixed(1) + '%',
        confidence95Interval: {
          lower: (avgOpinion - 1.96 * (stdDev / Math.sqrt(total))).toFixed(3),
          upper: (avgOpinion + 1.96 * (stdDev / Math.sqrt(total))).toFixed(3)
        }
      },
      polarization: {
        interpretation: this.interpretPolarization(stdDev),
        polarizationLevel: stdDev < 0.3 ? 'LOW' : stdDev < 0.5 ? 'MODERATE' : stdDev < 0.7 ? 'HIGH' : 'EXTREME',
        consensusLevel: consensus.toFixed(1) + '%',
        riskOfDivision: extremism > 30 ? 'HIGH' : extremism > 15 ? 'MEDIUM' : 'LOW'
      },
      geographicAnalysis: byState,
      demographicAnalysis: byDemographic,
      vulnerabilityAssessment: vulnerabilityAnalysis,
      riskAssessment: riskFactors,
      recommendations: this.generateStrategicRecommendations(verdict, supportPct, extremism, vulnerabilityAnalysis),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Analyze opinions by state
   */
  static analyzeByState(opinions) {
    const byState = {};

    opinions.forEach(o => {
      const state = o.state || 'Unknown';
      if (!byState[state]) {
        byState[state] = [];
      }
      byState[state].push(o);
    });

    const result = {};
    for (const [state, ops] of Object.entries(byState)) {
      const opinionVals = ops.map(o => parseFloat(o.opinion));
      const support = ops.filter(o => o.decision === 'SUPPORT').length;
      const oppose = ops.filter(o => o.decision === 'OPPOSE').length;

      result[state] = {
        sampleSize: ops.length,
        averageOpinion: (opinionVals.reduce((a, b) => a + b, 0) / ops.length).toFixed(3),
        supportRate: ((support / ops.length) * 100).toFixed(1) + '%',
        opposeRate: ((oppose / ops.length) * 100).toFixed(1) + '%',
        verdict: support > oppose ? 'SUPPORT' : oppose > support ? 'OPPOSE' : 'MIXED'
      };
    }

    return result;
  }

  /**
   * Analyze demographic patterns
   */
  static analyzeByDemographic(opinions) {
    // Group by age, income, education, urbanization
    const demographic = {
      byIncome: this.groupByIncome(opinions),
      byUrbanization: this.groupByUrbanization(opinions),
      byEducation: this.groupByEducation(opinions)
    };

    return demographic;
  }

  /**
   * Group by income level
   */
  static groupByIncome(opinions) {
    const groups = {
      'Poor (<₹2000)': [],
      'Lower Middle (₹2-5k)': [],
      'Middle (₹5-15k)': [],
      'Upper Middle (₹15-30k)': [],
      'Rich (>₹30k)': []
    };

    // Map opinions to groups based on available data
    opinions.forEach(o => {
      // Try to extract income info from breakdown
      let income = 0;
      if (o.breakdown?.economicScore !== undefined) {
        // Estimate income from economic score
        income = 5000; // default estimate
      }
      
      let group = 'Middle (₹5-15k)';
      if (income < 2000) group = 'Poor (<₹2000)';
      else if (income < 5000) group = 'Lower Middle (₹2-5k)';
      else if (income < 15000) group = 'Upper Middle (₹15-30k)';
      else group = 'Rich (>₹30k)';

      if (!groups[group]) groups[group] = [];
      groups[group].push(o);
    });

    const result = {};
    for (const [group, ops] of Object.entries(groups)) {
      if (ops.length > 0) {
        const opinionVals = ops.map(o => parseFloat(o.opinion));
        const support = ops.filter(o => o.decision === 'SUPPORT').length;

        result[group] = {
          count: ops.length,
          averageOpinion: (opinionVals.reduce((a, b) => a + b, 0) / ops.length).toFixed(3),
          supportRate: ((support / ops.length) * 100).toFixed(1) + '%'
        };
      }
    }

    return result;
  }

  /**
   * Group by urbanization
   */
  static groupByUrbanization(opinions) {
    const groups = { 'Urban': [], 'Semi-Urban': [], 'Rural': [] };

    opinions.forEach(o => {
      const urbanization = o.metadata?.urbanization || 'Semi-Urban';
      const group = urbanization.charAt(0).toUpperCase() + urbanization.slice(1);
      if (groups[group]) groups[group].push(o);
    });

    const result = {};
    for (const [group, ops] of Object.entries(groups)) {
      if (ops.length > 0) {
        const opinionVals = ops.map(o => parseFloat(o.opinion));
        result[group] = {
          count: ops.length,
          averageOpinion: (opinionVals.reduce((a, b) => a + b, 0) / ops.length).toFixed(3)
        };
      }
    }

    return result;
  }

  /**
   * Group by education level
   */
  static groupByEducation(opinions) {
    const groups = { 'Low': [], 'Medium': [], 'High': [] };

    opinions.forEach(o => {
      const edu = o.metadata?.educationLevel || 2;
      const group = edu < 2 ? 'Low' : edu < 4 ? 'Medium' : 'High';
      groups[group].push(o);
    });

    const result = {};
    for (const [group, ops] of Object.entries(groups)) {
      if (ops.length > 0) {
        const opinionVals = ops.map(o => parseFloat(o.opinion));
        result[group] = {
          count: ops.length,
          averageOpinion: (opinionVals.reduce((a, b) => a + b, 0) / ops.length).toFixed(3)
        };
      }
    }

    return result;
  }

  /**
   * Vulnerability assessment
   */
  static analyzeVulnerability(opinions) {
    const vulnerable = opinions.filter(o => {
      const decision = o.decision;
      return decision === 'OPPOSE'; // Simple proxy
    });

    return {
      vulnerableCount: vulnerable.length,
      vulnerablePercentage: ((vulnerable.length / opinions.length) * 100).toFixed(1) + '%',
      description: 'People who oppose the policy (potential vulnerable groups)'
    };
  }

  /**
   * Risk assessment
   */
  static assessRisks(verdict, supportPct, extremism, stdDev) {
    const risks = [];

    if (verdict === 'MAJORITY OPPOSE') {
      risks.push({
        type: 'POLITICAL',
        severity: 'CRITICAL',
        description: 'Majority opposition - Risk of policy rejection'
      });
    }

    if (extremism > 40) {
      risks.push({
        type: 'SOCIAL',
        severity: 'CRITICAL',
        description: 'Extreme polarization - Risk of social unrest'
      });
    }

    if (extremism > 25) {
      risks.push({
        type: 'IMPLEMENTATION',
        severity: 'HIGH',
        description: 'High polarization - Implementation challenges'
      });
    }

    if (stdDev > 0.6) {
      risks.push({
        type: 'CONSENSUS',
        severity: 'MEDIUM',
        description: 'Significant disagreement - Need for coalition building'
      });
    }

    if (supportPct < 40) {
      risks.push({
        type: 'PUBLIC_SUPPORT',
        severity: 'HIGH',
        description: 'Low public support - Communication needed'
      });
    }

    return risks.length > 0 ? risks : [
      {
        type: 'MONITORING',
        severity: 'LOW',
        description: 'Continue monitoring implementation'
      }
    ];
  }

  /**
   * Generate strategic recommendations
   */
  static generateStrategicRecommendations(verdict, supportPct, extremism, vulnerabilityAnalysis) {
    const recommendations = [];

    if (verdict === 'MAJORITY OPPOSE') {
      recommendations.push({
        priority: 'URGENT',
        action: 'Policy Revision',
        details: 'Review policy design based on opposition feedback'
      });
      recommendations.push({
        priority: 'HIGH',
        action: 'Stakeholder Engagement',
        details: 'Conduct targeted discussions with opposition groups'
      });
    } else if (verdict === 'MAJORITY SUPPORT') {
      recommendations.push({
        priority: 'HIGH',
        action: 'Implementation Planning',
        details: 'Proceed with phased implementation strategy'
      });
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Monitor Opposition',
        details: 'Track and address concerns from dissenting groups'
      });
    } else {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Awareness Campaign',
        details: 'Launch educational campaign to build understanding'
      });
    }

    if (extremism > 30) {
      recommendations.push({
        priority: 'URGENT',
        action: 'Conflict Mitigation',
        details: 'Implement mediation and dialogue programs'
      });
    }

    if (supportPct > 60) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Coalition Building',
        details: 'Strengthen support through stakeholder coordination'
      });
    }

    return recommendations;
  }

  /**
   * Interpretation of polarization
   */
  static interpretPolarization(stdDev) {
    if (stdDev < 0.3) return 'LOW POLARIZATION - Consensus exists';
    if (stdDev < 0.5) return 'MODERATE DIVISION - Some disagreement present';
    if (stdDev < 0.7) return 'HIGH POLARIZATION - Significant split detected';
    return 'EXTREME POLARIZATION - Deep societal division';
  }

  /**
   * Calculate 95% confidence interval
   */
  static calculateConfidenceInterval(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = this.calculateStdDev(values);
    const marginOfError = 1.96 * (stdDev / Math.sqrt(values.length));

    return {
      mean: mean.toFixed(3),
      marginOfError: marginOfError.toFixed(3),
      interval: [
        (mean - marginOfError).toFixed(3),
        (mean + marginOfError).toFixed(3)
      ]
    };
  }

  /**
   * Calculate standard deviation
   */
  static calculateStdDev(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }



  
  /**
   * Enrich and present existing summary
   */
  static enrichAndPresent(nationalSummary) {
    console.log('📊 Using pre-computed national summary');
    return nationalSummary;
  }



  /**
   * Display formatted research report
   */
  static displayResearchReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESEARCH REPORT - EXECUTIVE SUMMARY');
    console.log('='.repeat(80));

    const summary = report.executiveSummary || report;
    console.log(`\nPolicy Analysis: ${summary.totalPopulation} respondents`);
    console.log(`Support: ${summary.support.percentage} (${summary.support.count})`);
    console.log(`Oppose: ${summary.oppose.percentage} (${summary.oppose.count})`);
    console.log(`Neutral: ${summary.neutral.percentage} (${summary.neutral.count})`);
    console.log(`\nVerdict: ${summary.verdict}`);
    console.log(`Average Opinion: ${summary.averageOpinion}`);
    console.log(`Confidence: ${summary.averageConfidence}`);

    if (report.statisticalAnalysis) {
      console.log(`\nStandard Deviation: ${report.statisticalAnalysis.standardDeviation}`);
      console.log(`Polarization Index: ${report.statisticalAnalysis.polarizationIndex}`);
      console.log(`Extremism Rate: ${report.statisticalAnalysis.extremismRate}`);
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
}


export default DecisionResearchEngine;
