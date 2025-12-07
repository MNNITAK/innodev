/**
 * Main Population Generator Controller
 * Orchestrates generation for all states and creates national population graph
 */



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import StatePopulationGenerator from '../State_api/StatePopulationGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class PopulationGeneratorController {
  /**
   * Generate entire Indian population
   * @param {number} totalPopulation - Total humans (default 1000)
   * @param {number} outputDir - Output directory for data
   * @returns {Promise<Object>} - National population data
   */
  static async generateNationalPopulation(totalPopulation = 1000) {
    console.log('\n' + '='.repeat(60));
    console.log('🇮🇳 CIVI-GENESIS: NATIONAL POPULATION GENERATOR');
    console.log('='.repeat(60));
    console.log(`📊 Generating ${totalPopulation} synthetic citizens`);
    console.log(`⏰ Started: ${new Date().toISOString()}\n`);

    const stateDataPath = path.join(__dirname, '../state_data');
    const outputDir = path.join(__dirname, '../human_data');

    try {
      // Get all state files
      const stateFiles = fs.readdirSync(stateDataPath)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));

      console.log(`📍 Found ${stateFiles.length} states/UTs: ${stateFiles.join(', ')}\n`);

      // Distribute population across states by population size (simple equal distribution)
      const populationPerState = Math.ceil(totalPopulation / stateFiles.length);
      
      // Generate population for each state
      const statePopulations = {};
      const allHumans = [];
      const allConnections = [];
      const stateStatistics = {};

      for (const state of stateFiles) {
        try {
          const stateData = await StatePopulationGenerator.generateStatePopulation(
            state,
            populationPerState
          );

          statePopulations[state] = stateData;
          allHumans.push(...stateData.humans);
          allConnections.push(...stateData.connections);
          stateStatistics[state] = stateData.stats;

          // Save state-level data
          await StatePopulationGenerator.saveStatePopulation(stateData, outputDir);
        } catch (error) {
          console.error(`⚠️  Failed to generate population for ${state}:`, error.message);
          continue;
        }
      }

      console.log(`\n${'='.repeat(60)}`);
      console.log('🌐 Building National Population Graph...');
      console.log(`${'='.repeat(60)}\n`);

      // Build national graph
      const nationalGraph = this.buildNationalGraph(allHumans, allConnections);

      // Calculate national statistics
      const nationalStats = this.calculateNationalStatistics(
        allHumans,
        allConnections,
        statePopulations
      );

      console.log(`✅ National Graph Built:`);
      console.log(`   - Total Nodes: ${nationalGraph.nodeCount}`);
      console.log(`   - Total Edges: ${nationalGraph.edgeCount}`);
      console.log(`   - Average Degree: ${(nationalGraph.edgeCount / nationalGraph.nodeCount).toFixed(2)}`);

      // Save national data
      const nationalData = {
        country: 'India',
        totalPopulation: allHumans.length,
        states: Object.keys(statePopulations).length,
        generatedAt: new Date(),
        graph: nationalGraph,
        statistics: nationalStats,
      };

      await this.saveNationalPopulation(nationalData, outputDir);

      // Create summary report
      this.printSummaryReport(nationalStats, stateStatistics);

      console.log(`\n${'='.repeat(60)}`);
      console.log('✅ POPULATION GENERATION COMPLETE');
      console.log(`${'='.repeat(60)}\n`);

      return {
        success: true,
        message: `Generated ${allHumans.length} synthetic citizens across ${Object.keys(statePopulations).length} states`,
        totalHumans: allHumans.length,
        totalConnections: allConnections.length,
        statesGenerated: Object.keys(statePopulations),
        outputDirectory: outputDir,
        statistics: nationalStats,
      };
    } catch (error) {
      console.error('\n❌ CRITICAL ERROR:', error.message);
      throw error;
    }
  }

  /**
   * Build national population graph
   * @private
   */
  static buildNationalGraph(humans, connections) {
    const nodes = humans.map(h => ({
      id: h.humanId,
      state: h.state,
      district: h.district,
      age: h.demographics.age,
      education: h.socioEconomic.educationLevel,
      income: h.socioEconomic.incomePerCapita,
      householdId: h.householdId,
    }));

    const edges = connections.map(c => ({
      source: c.sourceId,
      target: c.targetId,
      type: c.relationType,
      weight: c.influenceWeight,
    }));

    const adjacency = new Map();
    humans.forEach(h => {
      adjacency.set(h.humanId, []);
    });

    edges.forEach(e => {
      if (adjacency.has(e.source)) {
        adjacency.get(e.source).push({
          target: e.target,
          type: e.type,
          weight: e.weight,
        });
      }
    });

    // Calculate network metrics
    const degreeDistribution = {};
    for (const neighbors of adjacency.values()) {
      const degree = neighbors.length;
      degreeDistribution[degree] = (degreeDistribution[degree] || 0) + 1;
    }

    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodes,
      edges,
      adjacency: Object.fromEntries(adjacency),
      metrics: {
        degreeDistribution,
        avgDegree: edges.length / nodes.length,
        density: (2 * edges.length) / (nodes.length * (nodes.length - 1)),
      },
    };
  }

  /**
   * Calculate national statistics
   * @private
   */
  static calculateNationalStatistics(humans, connections, statePopulations) {
    const stats = {
      population: {
        total: humans.length,
        byState: {},
        byUrbanization: {
          urban: humans.filter(h => h.demographics.urbanization === 'Urban').length,
          semiUrban: humans.filter(h => h.demographics.urbanization === 'Semi-Urban').length,
          rural: humans.filter(h => h.demographics.urbanization === 'Rural').length,
        },
      },

      demographics: {
        avgAge: Math.round(humans.reduce((a, h) => a + h.demographics.age, 0) / humans.length),
        sexRatio: {
          male: humans.filter(h => h.demographics.sex === 'Male').length,
          female: humans.filter(h => h.demographics.sex === 'Female').length,
          ratio: (humans.filter(h => h.demographics.sex === 'Female').length / 
                   humans.filter(h => h.demographics.sex === 'Male').length).toFixed(3),
        },
        religions: this.countByAttribute(humans, 'demographics.religion'),
        castes: this.countByAttribute(humans, 'demographics.caste'),
      },

      socioEconomic: {
        avgIncome: Math.round(humans.reduce((a, h) => a + h.socioEconomic.incomePerCapita, 0) / humans.length),
        povertyRate: (humans.filter(h => h.socioEconomic.povertyStatus === 1).length / humans.length * 100).toFixed(2),
        literacyRate: (humans.filter(h => h.socioEconomic.literacy > 0).length / humans.length * 100).toFixed(2),
        employmentTypes: this.countByAttribute(humans, 'socioEconomic.employmentType'),
        occupations: this.countByAttribute(humans, 'socioEconomic.occupation'),
      },

      network: {
        totalConnections: connections.length,
        byType: {
          family: connections.filter(c => ['spouse', 'parent', 'child', 'sibling'].includes(c.relationType)).length,
          friend: connections.filter(c => c.relationType === 'friend').length,
        },
        byWeight: {
          strong: connections.filter(c => c.influenceWeight > 0.7).length,
          moderate: connections.filter(c => c.influenceWeight > 0.4 && c.influenceWeight <= 0.7).length,
          weak: connections.filter(c => c.influenceWeight <= 0.4).length,
        },
        avgDegree: (connections.length / humans.length).toFixed(2),
      },

      behavioral: {
        avgTrust: Math.round(humans.reduce((a, h) => a + h.behavioral.institutionalTrust, 0) / humans.length),
        avgAdaptability: (humans.reduce((a, h) => a + h.behavioral.changeAdaptability, 0) / humans.length).toFixed(2),
        avgRiskTolerance: (humans.reduce((a, h) => a + h.behavioral.riskTolerance, 0) / humans.length).toFixed(2),
      },

      digital: {
        internetConnectivity: this.countByAttribute(humans, 'digital.internetConnectivity'),
        avgDigitalLiteracy: (humans.reduce((a, h) => a + h.digital.digitalLiteracy, 0) / humans.length).toFixed(2),
      },
    };

    // Add state-level breakdown
    for (const [state, data] of Object.entries(statePopulations)) {
      stats.population.byState[state] = data.humans.length;
    }

    return stats;
  }

  /**
   * Count attribute values
   * @private
   */
  static countByAttribute(humans, attrPath) {
    const counts = {};
    humans.forEach(h => {
      const keys = attrPath.split('.');
      let value = h;
      for (const key of keys) {
        value = value[key];
      }
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }

  /**
   * Save national population data
   * @private
   */
  static async saveNationalPopulation(nationalData, outputDir) {
    try {
      // Save national graph summary
      const summaryPath = path.join(outputDir, 'national_summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify({
        country: nationalData.country,
        totalPopulation: nationalData.totalPopulation,
        states: nationalData.states,
        statistics: nationalData.statistics,
        generatedAt: nationalData.generatedAt,
      }, null, 2));
      console.log(`✓ Saved national summary to ${summaryPath}`);

      // Save condensed graph (node/edge counts only for large networks)
      const graphPath = path.join(outputDir, 'national_graph_metadata.json');
      fs.writeFileSync(graphPath, JSON.stringify({
        nodeCount: nationalData.graph.nodeCount,
        edgeCount: nationalData.graph.edgeCount,
        metrics: nationalData.graph.metrics,
        generatedAt: nationalData.generatedAt,
      }, null, 2));
      console.log(`✓ Saved national graph metadata to ${graphPath}`);

    } catch (error) {
      console.error('Error saving national population:', error.message);
      throw error;
    }
  }

  /**
   * Print summary report
   * @private
   */
  static printSummaryReport(nationalStats, stateStats) {
    console.log('\n' + '█'.repeat(60));
    console.log('📊 NATIONAL POPULATION SUMMARY');
    console.log('█'.repeat(60));

    console.log('\n👥 DEMOGRAPHICS:');
    console.log(`   • Total Population: ${nationalStats.population.total.toLocaleString()}`);
    console.log(`   • Average Age: ${nationalStats.demographics.avgAge} years`);
    console.log(`   • Sex Ratio (F:M): ${nationalStats.demographics.sexRatio.ratio}`);
    console.log(`   • Urbanization:`);
    console.log(`     - Urban: ${nationalStats.population.byUrbanization.urban}`);
    console.log(`     - Semi-Urban: ${nationalStats.population.byUrbanization.semiUrban}`);
    console.log(`     - Rural: ${nationalStats.population.byUrbanization.rural}`);

    console.log('\n💰 SOCIO-ECONOMIC:');
    console.log(`   • Average Income: ₹${nationalStats.socioEconomic.avgIncome.toLocaleString()}`);
    console.log(`   • Poverty Rate: ${nationalStats.socioEconomic.povertyRate}%`);
    console.log(`   • Literacy Rate: ${nationalStats.socioEconomic.literacyRate}%`);

    console.log('\n🤝 NETWORK:');
    console.log(`   • Total Connections: ${nationalStats.network.totalConnections.toLocaleString()}`);
    console.log(`   • Family Ties: ${nationalStats.network.byType.family}`);
    console.log(`   • Friendships: ${nationalStats.network.byType.friend}`);
    console.log(`   • Average Connections/Person: ${nationalStats.network.avgDegree}`);

    console.log('\n🧠 BEHAVIORAL:');
    console.log(`   • Avg Institutional Trust: ${nationalStats.behavioral.avgTrust}/100`);
    console.log(`   • Avg Adaptability: ${nationalStats.behavioral.avgAdaptability}/5`);
    console.log(`   • Avg Risk Tolerance: ${nationalStats.behavioral.avgRiskTolerance}/5`);

    console.log('\n🌐 DIGITAL:');
    console.log(`   • Avg Digital Literacy: ${nationalStats.digital.avgDigitalLiteracy}/5`);

    console.log('\n' + '█'.repeat(60) + '\n');
  }
}

export default PopulationGeneratorController;
