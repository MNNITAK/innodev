/**
 * State-level population generator
 * Generates entire population for a state based on divisional data
 */

import fs from 'fs';
import path from 'path';
import FamilyClusterer from '../utils/familyClusterer.js';
import FriendNetworkBuilder from '../utils/friendNetworkBuilder.js';
import { fileURLToPath } from 'url'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StatePopulationGenerator {
  /**
   * Generate entire state population
   */

  static async generateStatePopulation(stateName, targetPopulation = 1000) {
    console.log(`\n🔄 Starting population generation for ${stateName}...`);
    console.log(`Target population: ${targetPopulation}`);

    try {
      // Load state data
         const stateDataPath = path.join(__dirname, `../state_data/${stateName}.json`);
      const stateData = JSON.parse(fs.readFileSync(stateDataPath, 'utf8'));

      if (!stateData.divisions) {
        throw new Error(`Invalid state data: no divisions found in ${stateName}.json`);
      }


      console.log(`✓ Loaded state data with ${stateData.divisions.length} divisions`);

      
      // Distribute population across divisions proportionally
      const divisionPopulations = this.distributePopulation(
        stateData.divisions,
        targetPopulation
      );

      // Generate households and families for each division
      const allHumans = [];
      const allConnections = [];
      const divisionStats = {};

      for (let i = 0; i < stateData.divisions.length; i++) {
        const division = stateData.divisions[i];
        const divisionPop = divisionPopulations[i];

        if (divisionPop > 0) {
          console.log(`  → ${division.name}: ${divisionPop} humans`);

          // Convert factor array to map for easier access
          const factorMap = {};
          division.factors.forEach(f => {
            factorMap[f.name] = f.value;
          });

          // Generate families for this division
          const { households, humans, connections } = FamilyClusterer.generateHouseholds(
            divisionPop,
            factorMap,
            stateName,
            division.name
          );

          allHumans.push(...humans);
          allConnections.push(...connections);

          divisionStats[division.name] = {
            households: households.length,
            population: humans.length,
            avgFamilySize: (humans.length / households.length).toFixed(2),
          };
        }
      }

      console.log(`✓ Generated ${allHumans.length} humans in families`);

      // Build friend networks within the state
      console.log(`  → Building friend network (${allHumans.length} people)...`);
      const friendConnections = FriendNetworkBuilder.buildFriendNetwork(
        allHumans,
        5 // Average 5 friends per person
      );
      allConnections.push(...friendConnections);

      // Add weak ties for network resilience
      const weakTies = FriendNetworkBuilder.addWeakTies(allHumans, 5);
      allConnections.push(...weakTies);

      console.log(`✓ Generated ${friendConnections.length + weakTies.length} friend connections`);

      // Build population graph
      const populationGraph = this.buildPopulationGraph(allHumans, allConnections);

      // Calculate statistics
      const stats = this.calculateStatistics(allHumans, allConnections, populationGraph);

      console.log(`\n✅ Population generation complete for ${stateName}`);
      console.log(`   Total humans: ${allHumans.length}`);
      console.log(`   Total connections: ${allConnections.length}`);
      console.log(`   Avg connections per person: ${(allConnections.length / allHumans.length).toFixed(2)}`);

      return {
        stateName,
        humans: allHumans,
        connections: allConnections,
        populationGraph,
        divisionStats,
        stats,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error(`❌ Error generating population for ${stateName}:`, error.message);
      throw error;
    }
  }

  /**
   * Distribute population across divisions based on their characteristics
   */

  static distributePopulation(divisions, totalPopulation) {
    // Simple distribution: equal per division (can be enhanced with real demographic data)
    const popPerDivision = Math.ceil(totalPopulation / divisions.length);
    return divisions.map((_, i) => {
      if (i === divisions.length - 1) {
        // Last division gets remainder
        return totalPopulation - (popPerDivision * (divisions.length - 1));
      }
      return popPerDivision;
    });
  }

  /**
   * Build graph representation of population
  +
   */
  static buildPopulationGraph(humans, connections) {
    const nodes = humans.map(h => ({
      id: h.humanId,
      label: `${h.humanId}`,
      age: h.demographics.age,
      householdId: h.householdId,
      state: h.state,
      district: h.district,
      education: h.socioEconomic.educationLevel,
      income: h.socioEconomic.incomePerCapita,
    }));

    const edges = connections.map(c => ({
      source: c.sourceId,
      target: c.targetId,
      type: c.relationType,
      weight: c.influenceWeight,
    }));

    // Build adjacency info for each node
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

    return {
      nodes,
      edges,
      adjacency: Object.fromEntries(adjacency),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    };
  }

  /**
   * Calculate population statistics
   * @private
   */
  static calculateStatistics(humans, connections, graph) {
    const stats = {
      totalPopulation: humans.length,
      totalConnections: connections.length,
      avgDegree: connections.length / humans.length,
      
      // Demographics
      demographics: {
        avgAge: Math.round(humans.reduce((a, h) => a + h.demographics.age, 0) / humans.length),
        ageRange: {
          min: Math.min(...humans.map(h => h.demographics.age)),
          max: Math.max(...humans.map(h => h.demographics.age)),
        },
        sexRatio: {
          male: humans.filter(h => h.demographics.sex === 'Male').length,
          female: humans.filter(h => h.demographics.sex === 'Female').length,
        },
        urbanization: {
          urban: humans.filter(h => h.demographics.urbanization === 'Urban').length,
          semiUrban: humans.filter(h => h.demographics.urbanization === 'Semi-Urban').length,
          rural: humans.filter(h => h.demographics.urbanization === 'Rural').length,
        },
      },

      // Socio-economic
      socioEconomic: {
        avgIncome: Math.round(humans.reduce((a, h) => a + h.socioEconomic.incomePerCapita, 0) / humans.length),
        incomeRange: {
          min: Math.min(...humans.map(h => h.socioEconomic.incomePerCapita)),
          max: Math.max(...humans.map(h => h.socioEconomic.incomePerCapita)),
        },
        povertyRate: (humans.filter(h => h.socioEconomic.povertyStatus === 1).length / humans.length * 100).toFixed(2),
        literacyRate: (humans.filter(h => h.socioEconomic.literacy > 0).length / humans.length * 100).toFixed(2),
        occupations: this.countByField(humans, 'socioEconomic.occupation'),
      },

      // Social network
      network: {
        familyConnections: connections.filter(c => c.relationType !== 'friend').length,
        friendConnections: connections.filter(c => c.relationType === 'friend').length,
        strongConnections: connections.filter(c => c.influenceWeight > 0.7).length,
        weakConnections: connections.filter(c => c.influenceWeight <= 0.3).length,
      },

      // Behavioral
      behavioral: {
        avgTrust: Math.round(humans.reduce((a, h) => a + h.behavioral.institutionalTrust, 0) / humans.length),
        avgAdaptability: Math.round(humans.reduce((a, h) => a + h.behavioral.changeAdaptability, 0) / humans.length * 20),
      },
    };

    return stats;
  }

  /**
   * Count occurrences of field values
   * @private
   */
  static countByField(humans, fieldPath) {
    const counts = {};
    humans.forEach(h => {
      const keys = fieldPath.split('.');
      let value = h;
      for (const key of keys) {
        value = value[key];
      }
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }

  /**
   * Save state population to JSON file
   * @param {Object} populationData - Output from generateStatePopulation
   * @param {string} outputDir - Directory to save to
   */
  static async saveStatePopulation(populationData, outputDir) {
    try {
      const stateDir = path.join(outputDir, populationData.stateName);
      
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }

      // Save main population graph
      const graphPath = path.join(stateDir, 'population_graph.json');
      fs.writeFileSync(graphPath, JSON.stringify(populationData.populationGraph, null, 2));
      console.log(`✓ Saved population graph to ${graphPath}`);

      // Save human data
      const humansPath = path.join(stateDir, 'humans.json');
      fs.writeFileSync(humansPath, JSON.stringify(populationData.humans, null, 2));
      console.log(`✓ Saved humans data to ${humansPath}`);

      // Save connections
      const connectionsPath = path.join(stateDir, 'connections.json');
      fs.writeFileSync(connectionsPath, JSON.stringify(populationData.connections, null, 2));
      console.log(`✓ Saved connections to ${connectionsPath}`);

      // Save statistics
      const statsPath = path.join(stateDir, 'statistics.json');
      fs.writeFileSync(statsPath, JSON.stringify({
        stats: populationData.stats,
        divisionStats: populationData.divisionStats,
        generatedAt: populationData.generatedAt,
      }, null, 2));
      console.log(`✓ Saved statistics to ${statsPath}`);

      // Save metadata
      const metadataPath = path.join(stateDir, 'metadata.json');
      fs.writeFileSync(metadataPath, JSON.stringify({
        state: populationData.stateName,
        totalPopulation: populationData.humans.length,
        totalConnections: populationData.connections.length,
        divisions: Object.keys(populationData.divisionStats).length,
        generatedAt: populationData.generatedAt,
      }, null, 2));
      console.log(`✓ Saved metadata to ${metadataPath}`);

      return stateDir;
    } catch (error) {
      console.error('Error saving state population:', error.message);
      throw error;
    }
  }
}

export default StatePopulationGenerator;
