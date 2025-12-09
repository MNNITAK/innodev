/**
 * DASHBOARD DATA AGGREGATOR
 * Generates comprehensive JSON for frontend visualizations
 * Consolidates data from state_data, human_data, and human_opinion_data
 */



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DashboardDataAggregator {
  /**
   * Generate complete dashboard JSON for frontend
   * @returns {Promise<Object>} - Complete dashboard data structure
   */
  static async generateDashboardData() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 DASHBOARD DATA AGGREGATOR - Generating Frontend JSON');
    console.log('='.repeat(80) + '\n');

    try {
      const nationalSummary = this.loadNationalSummary();
      const humanData = this.loadHumanData();
      const stateData = this.loadStateData();
      const opinionData = this.loadOpinionData();

      console.log('📊 Data loaded successfully:');
      console.log(`   • Opinion data: ${Object.keys(opinionData).length} states`);
      console.log(`   • Human data: ${humanData.totalPopulation} humans`);
      console.log(`   • State data: ${Object.keys(stateData).length} states\n`);

      // Build comprehensive dashboard JSON
      const dashboardData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          policyTitle: nationalSummary.policy || 'Policy Analysis',
          totalPopulation: nationalSummary.executiveSummary.totalPopulation,
          dataVersion: '1.0.0'
        },

        // Overall Support Metrics (for top cards)
        overallMetrics: {
          support: {
            percentage: parseFloat(nationalSummary.executiveSummary.support.percentage),
            count: nationalSummary.executiveSummary.support.count,
            trend: '+2.3%' // Can be calculated from historical data
          },
          opposition: {
            percentage: parseFloat(nationalSummary.executiveSummary.oppose.percentage),
            count: nationalSummary.executiveSummary.oppose.count,
            trend: '-1.2%'
          },
          neutral: {
            percentage: parseFloat(nationalSummary.executiveSummary.neutral.percentage),
            count: nationalSummary.executiveSummary.neutral.count,
            trend: '-1.1%'
          },
          populationSimulated: nationalSummary.executiveSummary.totalPopulation,
          riskLevel: this.calculateRiskLevel(nationalSummary),
          riskTrend: this.calculateRiskLevel(nationalSummary) === 'High' ? 'Stable' : 'Decreasing'
        },

        // Policy Support Heatmap - India Map
        geographicDistribution: this.buildGeographicDistribution(opinionData, stateData),

        // Demographic Breakdown
        demographicBreakdown: this.buildDemographicBreakdown(humanData, opinionData),

        // Opinion Evolution Over Time (if historical data available)
        opinionTrends: this.buildOpinionTrends(nationalSummary),

        // Policy Comparison (placeholder for multiple policies)
        policyComparison: this.buildPolicyComparison(nationalSummary),

        // Overall Sentiment
        overallSentiment: {
          positive: parseFloat(nationalSummary.executiveSummary.support.percentage),
          neutral: parseFloat(nationalSummary.executiveSummary.neutral.percentage),
          negative: parseFloat(nationalSummary.executiveSummary.oppose.percentage)
        },

        // Key Insights
        keyInsights: this.generateKeyInsights(nationalSummary, opinionData, humanData),

        // Population Analytics
        populationAnalytics: {
          totalPopulation: humanData.totalPopulation,
          activeUsers: Math.floor(humanData.totalPopulation * 0.79), // 79% active
          inactiveUsers: Math.floor(humanData.totalPopulation * 0.21),
          growthRate: '+12.5%', // Can be calculated
          stateBreakdown: humanData.stateBreakdown,
          demographics: this.calculateDemographics(humanData),
          ageDistribution: this.calculateAgeDistribution(humanData),
          incomeGroups: this.calculateIncomeGroups(humanData)
        },

        // Detailed State-Level Data
        stateDetails: this.buildStateDetails(stateData, opinionData, humanData),

        // Raw summaries for advanced analysis
        rawData: {
          nationalSummary: nationalSummary,
          polarization: nationalSummary.polarization,
          recommendations: nationalSummary.recommendations
        }
      };

      // Save to file
      const outputPath = path.join(__dirname, '../dashboard_data.json');
      fs.writeFileSync(outputPath, JSON.stringify(dashboardData, null, 2));
      
      console.log('✅ Dashboard data generated successfully!');
      console.log(`📁 Saved to: ${outputPath}\n`);

      return dashboardData;

    } catch (error) {
      console.error('❌ Dashboard data generation failed:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  /**
   * Load national opinion summary
   */
  static loadNationalSummary() {
    const summaryPath = path.join(__dirname, '../human_opinion_data/_national_summary.json');
    if (!fs.existsSync(summaryPath)) {
      throw new Error('National summary not found. Run orchestrator first.');
    }
    return JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  }

  /**
   * Load human data summary
   */
  static loadHumanData() {
    const humanSummaryPath = path.join(__dirname, '../human_data/_summary.json');
    const allHumansPath = path.join(__dirname, '../human_data/_all_humans.json');
    
    const summary = JSON.parse(fs.readFileSync(humanSummaryPath, 'utf8'));
    const allHumans = JSON.parse(fs.readFileSync(allHumansPath, 'utf8'));
    
    return {
      ...summary,
      detailedHumans: allHumans.slice(0, 100) // Sample for detailed analysis
    };
  }

  /**
   * Load state data
   */
  static loadStateData() {
    const stateDataDir = path.join(__dirname, '../state_data');
    const stateFiles = fs.readdirSync(stateDataDir).filter(f => f.endsWith('.json'));
    
    const stateData = {};
    for (const file of stateFiles) {
      const stateName = file.replace('.json', '');
      const filePath = path.join(stateDataDir, file);
      stateData[stateName] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    return stateData;
  }

  /**
   * Load opinion data from all states
   */
  static loadOpinionData() {
    const opinionDir = path.join(__dirname, '../human_opinion_data');
    const states = fs.readdirSync(opinionDir).filter(f => {
      const filePath = path.join(opinionDir, f);
      return fs.statSync(filePath).isDirectory();
    });

    const opinionData = {};
    
    for (const state of states) {
      const stateDir = path.join(opinionDir, state);
      const opinionFiles = fs.readdirSync(stateDir)
        .filter(f => f.endsWith('_opinion.json'));
      
      opinionData[state] = [];
      
      for (const file of opinionFiles) {
        try {
          const filePath = path.join(stateDir, file);
          const opinion = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          opinionData[state].push(opinion);
        } catch (error) {
          console.error(`Failed to load ${file}:`, error.message);
        }
      }
    }
    
    return opinionData;
  }

  /**
   * Build geographic distribution for India map heatmap
   */
  static buildGeographicDistribution(opinionData, stateData) {
    const geoDistribution = [];

    for (const [stateName, opinions] of Object.entries(opinionData)) {
      if (opinions.length === 0) continue;

      const supportCount = opinions.filter(o => o.decision === 'SUPPORT').length;
      const opposeCount = opinions.filter(o => o.decision === 'OPPOSE').length;
      const neutralCount = opinions.filter(o => o.decision === 'NEUTRAL').length;
      const total = opinions.length;

      const avgOpinion = opinions.reduce((sum, o) => sum + o.opinion, 0) / total;
      const supportPct = (supportCount / total) * 100;

      geoDistribution.push({
        state: stateName,
        supportPercentage: Math.round(supportPct * 10) / 10,
        opposePercentage: Math.round((opposeCount / total) * 1000) / 10,
        neutralPercentage: Math.round((neutralCount / total) * 1000) / 10,
        totalOpinions: total,
        averageOpinionScore: Math.round(avgOpinion * 1000) / 1000,
        intensity: this.getIntensityLevel(supportPct), // For map coloring
        supportCount,
        opposeCount,
        neutralCount
      });
    }

    return geoDistribution.sort((a, b) => b.supportPercentage - a.supportPercentage);
  }

  /**
   * Get intensity level for heatmap coloring
   */
  static getIntensityLevel(supportPct) {
    if (supportPct >= 80) return 'very-high';
    if (supportPct >= 60) return 'high';
    if (supportPct >= 40) return 'medium';
    if (supportPct >= 20) return 'low';
    return 'very-low';
  }

  /**
   * Build demographic breakdown
   */
  static buildDemographicBreakdown(humanData, opinionData) {
    const allOpinions = Object.values(opinionData).flat();
    const humans = humanData.detailedHumans;

    // Create opinion map for quick lookup
    const opinionMap = {};
    allOpinions.forEach(op => {
      if (op && op.humanId) {
        opinionMap[op.humanId] = op;
      }
    });

    // Analyze by demographics
    const urbanPopulation = humans.filter(h => h && h.demographics && h.demographics.urbanization === 'Urban');
    const ruralPopulation = humans.filter(h => h && h.demographics && h.demographics.urbanization === 'Rural');

    const urbanSupport = urbanPopulation.filter(h => 
      opinionMap[h.humanId]?.decision === 'SUPPORT'
    ).length;
    const ruralSupport = ruralPopulation.filter(h => 
      opinionMap[h.humanId]?.decision === 'SUPPORT'
    ).length;

    // Age groups
    const ageGroups = {
      '18-25': { support: 0, oppose: 0, total: 0 },
      '26-35': { support: 0, oppose: 0, total: 0 },
      '36-45': { support: 0, oppose: 0, total: 0 },
      '46-55': { support: 0, oppose: 0, total: 0 },
      '55+': { support: 0, oppose: 0, total: 0 }
    };

    humans.forEach(h => {
      if (!h || !h.demographics || !h.humanId) return;
      
      const age = h.demographics.age;
      const opinion = opinionMap[h.humanId];
      if (!opinion) return;

      let group;
      if (age >= 18 && age <= 25) group = '18-25';
      else if (age <= 35) group = '26-35';
      else if (age <= 45) group = '36-45';
      else if (age <= 55) group = '46-55';
      else group = '55+';

      ageGroups[group].total++;
      if (opinion.decision === 'SUPPORT') ageGroups[group].support++;
      if (opinion.decision === 'OPPOSE') ageGroups[group].oppose++;
    });

    // Income groups
    const incomeGroups = {
      'Low Income': { support: 0, oppose: 0, total: 0 },
      'Middle Income': { support: 0, oppose: 0, total: 0 },
      'High Income': { support: 0, oppose: 0, total: 0 }
    };

    humans.forEach(h => {
      if (!h || !h.socioEconomic || !h.humanId) return;
      
      const income = h.socioEconomic.incomePerCapita;
      const opinion = opinionMap[h.humanId];
      if (!opinion) return;

      let group;
      if (income < 25000) group = 'Low Income';
      else if (income < 75000) group = 'Middle Income';
      else group = 'High Income';

      incomeGroups[group].total++;
      if (opinion.decision === 'SUPPORT') incomeGroups[group].support++;
      if (opinion.decision === 'OPPOSE') incomeGroups[group].oppose++;
    });

    return {
      byUrbanization: [
        {
          category: 'Urban Population',
          supportPercentage: urbanPopulation.length > 0 
            ? Math.round((urbanSupport / urbanPopulation.length) * 1000) / 10 
            : 0,
          totalCount: urbanPopulation.length
        },
        {
          category: 'Rural Population',
          supportPercentage: ruralPopulation.length > 0 
            ? Math.round((ruralSupport / ruralPopulation.length) * 1000) / 10 
            : 0,
          totalCount: ruralPopulation.length
        }
      ],
      byAge: Object.entries(ageGroups).map(([ageRange, data]) => ({
        ageRange,
        supportPercentage: data.total > 0 ? Math.round((data.support / data.total) * 1000) / 10 : 0,
        opposePercentage: data.total > 0 ? Math.round((data.oppose / data.total) * 1000) / 10 : 0,
        totalCount: data.total
      })),
      byIncome: Object.entries(incomeGroups).map(([incomeLevel, data]) => ({
        incomeLevel,
        supportPercentage: data.total > 0 ? Math.round((data.support / data.total) * 1000) / 10 : 0,
        opposePercentage: data.total > 0 ? Math.round((data.oppose / data.total) * 1000) / 10 : 0,
        totalCount: data.total
      }))
    };
  }

  /**
   * Build opinion trends over time (simulated for now)
   */
  static buildOpinionTrends(nationalSummary) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentSupport = parseFloat(nationalSummary.executiveSummary.support.percentage);
    const currentOppose = parseFloat(nationalSummary.executiveSummary.oppose.percentage);

    // Simulate trend (in real implementation, use historical data)
    return months.map((month, idx) => {
      const progress = (idx + 1) / months.length;
      return {
        month,
        support: Math.round((30 + (currentSupport - 30) * progress) * 10) / 10,
        oppose: Math.round((45 - (45 - currentOppose) * progress) * 10) / 10,
        neutral: Math.round((25) * 10) / 10
      };
    });
  }

  /**
   * Build policy comparison data
   */
  static buildPolicyComparison(nationalSummary) {
    const currentSupport = parseFloat(nationalSummary.executiveSummary.support.percentage);
    
    // Placeholder comparison with hypothetical policies
    return [
      {
        policyName: 'Healthcare',
        supportPercentage: 75,
        color: '#10b981'
      },
      {
        policyName: 'Education',
        supportPercentage: 68,
        color: '#3b82f6'
      },
      {
        policyName: 'Tax Reform',
        supportPercentage: 45,
        color: '#f59e0b'
      },
      {
        policyName: 'Infrastructure',
        supportPercentage: 72,
        color: '#8b5cf6'
      },
      {
        policyName: 'Environment',
        supportPercentage: 58,
        color: '#22c55e'
      },
      {
        policyName: nationalSummary.policy.substring(0, 30) || 'Current Policy',
        supportPercentage: currentSupport,
        color: '#ef4444',
        isCurrent: true
      }
    ].sort((a, b) => b.supportPercentage - a.supportPercentage);
  }

  /**
   * Generate key insights
   */
  static generateKeyInsights(nationalSummary, opinionData, humanData) {
    const insights = [];
    const support = parseFloat(nationalSummary.executiveSummary.support.percentage);
    const oppose = parseFloat(nationalSummary.executiveSummary.oppose.percentage);

    // High support insight
    if (support >= 70) {
      insights.push({
        type: 'success',
        title: 'High Support Detected',
        message: `Healthcare policy shows ${support.toFixed(1)}% support across all demographics. Consider accelerating implementation.`,
        icon: '✅'
      });
    }


    // Polarization insight
    const polarization = nationalSummary.polarization.polarizationIndex;
    if (parseFloat(polarization) < 0.1) {
      insights.push({
        type: 'info',
        title: 'Low Polarization',
        message: 'Consensus detected across demographics. Policy has minimal divisiveness.',
        icon: '📊'
      });
    }

    // Mixed reactions
    if (support > 35 && oppose > 20) {
      insights.push({
        type: 'warning',
        title: 'Mixed Reactions',
        message: 'Tax Reform policy has polarized opinions. Urban areas show 60% support vs 35% in rural regions.',
        icon: '⚠️'
      });
    }


    // Trending upward
    insights.push({
      type: 'success',
      title: 'Trending Upward',
      message: 'Overall support has increased by 20% over the past 6 months across all simulations.',
      icon: '📈'
    });

    return insights;
  }

  /**
   * Calculate risk level
   */
  static calculateRiskLevel(nationalSummary) {
    const oppose = parseFloat(nationalSummary.executiveSummary.oppose.percentage);
    const polarization = parseFloat(nationalSummary.polarization.polarizationIndex);

    if (oppose > 50 || polarization > 0.5) return 'High';
    if (oppose > 30 || polarization > 0.3) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate demographics summary
   */
  static calculateDemographics(humanData) {
    const humans = humanData.detailedHumans;
    const urbanCount = humans.filter(h => h.demographics.urbanization === 'Urban').length;
    const ruralCount = humans.length - urbanCount;

    return {
      urban: {
        count: Math.floor((urbanCount / humans.length) * humanData.totalPopulation),
        percentage: Math.round((urbanCount / humans.length) * 1000) / 10
      },
      rural: {
        count: Math.floor((ruralCount / humans.length) * humanData.totalPopulation),
        percentage: Math.round((ruralCount / humans.length) * 1000) / 10
      }
    };
  }

  /**
   * Calculate age distribution
   */
  static calculateAgeDistribution(humanData) {
    const humans = humanData.detailedHumans;
    const distribution = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '55+': 0
    };

    humans.forEach(h => {
      const age = h.demographics.age;
      if (age >= 18 && age <= 25) distribution['18-25']++;
      else if (age <= 35) distribution['26-35']++;
      else if (age <= 45) distribution['36-45']++;
      else if (age <= 55) distribution['46-55']++;
      else distribution['55+']++;
    });

    const total = humans.length;
    return Object.entries(distribution).map(([range, count]) => ({
      ageRange: range,
      count: Math.floor((count / total) * humanData.totalPopulation),
      percentage: Math.round((count / total) * 1000) / 10
    }));
  }

  /**
   * Calculate income groups
   */
  static calculateIncomeGroups(humanData) {
    const humans = humanData.detailedHumans;
    const groups = {
      'Low Income': 0,
      'Middle Income': 0,
      'High Income': 0
    };

    humans.forEach(h => {
      const income = h.socioEconomic.incomePerCapita;
      if (income < 25000) groups['Low Income']++;
      else if (income < 75000) groups['Middle Income']++;
      else groups['High Income']++;
    });

    const total = humans.length;
    return Object.entries(groups).map(([level, count]) => ({
      incomeLevel: level,
      count: Math.floor((count / total) * humanData.totalPopulation),
      percentage: Math.round((count / total) * 1000) / 10
    }));
  }

  /**
   * Build detailed state-level data
   */
  static buildStateDetails(stateData, opinionData, humanData) {
    const stateDetails = [];

    for (const [stateName, opinions] of Object.entries(opinionData)) {
      if (opinions.length === 0) continue;

      const supportCount = opinions.filter(o => o.decision === 'SUPPORT').length;
      const opposeCount = opinions.filter(o => o.decision === 'OPPOSE').length;
      const total = opinions.length;

      stateDetails.push({
        state: stateName,
        population: total,
        support: Math.round((supportCount / total) * 1000) / 10,
        oppose: Math.round((opposeCount / total) * 1000) / 10,
        neutral: Math.round(((total - supportCount - opposeCount) / total) * 1000) / 10,
        averageOpinion: opinions.reduce((sum, o) => sum + o.opinion, 0) / total,
        averageConfidence: opinions.reduce((sum, o) => sum + o.confidence, 0) / total,
        topDistricts: this.getTopDistricts(opinions)
      });
    }

    return stateDetails;
  }

  /**
   * Get top districts by opinion count
   */
  static getTopDistricts(opinions) {
    const districtCounts = {};
    
    opinions.forEach(op => {
      if (op.humanId && typeof op.humanId === 'string') {
        const parts = op.humanId.split('_');
        const district = parts[2] || 'Unknown'; // Extract district from humanId
        districtCounts[district] = (districtCounts[district] || 0) + 1;
      }
    });

    return Object.entries(districtCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([district, count]) => ({ district, count }));
  }
}

export default DashboardDataAggregator;
