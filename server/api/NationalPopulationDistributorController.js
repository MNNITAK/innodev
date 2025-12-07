/**
 * National Population Distributor Controller
 * Distributes total population across Indian states based on real population ratios
 * and orchestrates StatePopulationGenerator for each state
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import StatePopulationGenerator from '../State_api/StatePopulationGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real India 2021 Census population ratios (normalized)
const STATE_POPULATION_RATIOS = {
  UP: 0.16833,           // Uttar Pradesh - 19.98 crore
  Bihar: 0.10358,        // Bihar - 12.31 crore
  WB: 0.07255,           // West Bengal - 8.63 crore
  Maharastra: 0.08994,   // Maharashtra - 10.70 crore
  Odissa: 0.04289,       // Odisha - 5.10 crore
  Rajasthan: 0.05595,    // Rajasthan - 6.65 crore
  Punjab: 0.02429,       // Punjab - 2.89 crore
  Assam: 0.03998,        // Assam - 4.76 crore
  Jharkhand: 0.03233,    // Jharkhand - 3.84 crore
  Uttrakhand: 0.01012,   // Uttarakhand - 1.20 crore
  AndhraPradesh: 0.06901,// Andhra Pradesh - 8.21 crore
  Kerala: 0.02816,       // Kerala - 3.35 crore
  haryana: 0.02099,      // Haryana - 2.50 crore
  Delhi: 0.01692,        // Delhi - 2.01 crore
  Himachal: 0.00540,     // Himachal Pradesh - 0.64 crore
  Jammu_kashmir: 0.01256,// Jammu & Kashmir - 1.49 crore
  GOA: 0.00167,          // Goa - 0.20 crore
  Manipur: 0.00286,      // Manipur - 0.34 crore
  Mizoram: 0.00108,      // Mizoram - 0.13 crore
  Nagaland: 0.00107,     // Nagaland - 0.13 crore
  Arunachal: 0.00154,    // Arunachal Pradesh - 0.18 crore
  AndamanNicobar: 0.00040// Andaman & Nicobar - 0.05 crore
};


class NationalPopulationDistributorController {
  /**
   * Distribute population across all Indian states based on real ratios
   * @param {number} totalPopulation - Total population to distribute
   * @returns {Promise<Object>} - Result with distribution details
   */
  static async distributeAndGeneratePopulation(totalPopulation = 1000) {
    console.log('\n' + '='.repeat(60));
    console.log('🇮🇳 NATIONAL POPULATION DISTRIBUTOR');
    console.log('='.repeat(60));
    console.log(`📊 Total Population: ${totalPopulation}`);
    console.log(`⏰ Started: ${new Date().toISOString()}\n`);

    const stateDataPath = path.join(__dirname, '../state_data');
    const outputDir = path.join(__dirname, '../human_data');

    try {
      // Get all available state files
      const stateFiles = fs.readdirSync(stateDataPath)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));

      console.log(`📍 Found ${stateFiles.length} states/UTs\n`);

      // Distribute population based on real ratios
      const statePopulations = this.calculateStatePopulations(
        stateFiles,
        totalPopulation
      );



      console.log('📈 Distribution breakdown:');


      console.log('─'.repeat(60));
      


      
      let totalDistributed = 0;
      for (const [state, population] of Object.entries(statePopulations)) {
        const percentage = ((population / totalPopulation) * 100).toFixed(2);
        console.log(`  ${state.padEnd(20)} │ ${population.toString().padStart(6)} citizens (${percentage}%)`);
        totalDistributed += population;
      }
      console.log('─'.repeat(60));
      console.log(`  Total Distributed: ${totalDistributed}\n`);

      // Generate population for each state
      const results = [];
      const stateUpdateLogs = [];

      for (const [state, population] of Object.entries(statePopulations)) {
        try {
          console.log(`\n🔄 Processing ${state} (${population} citizens)...`);
          
          const stateData = await StatePopulationGenerator.generateStatePopulation(
            state,
            population
          );

          // Save state population
          await StatePopulationGenerator.saveStatePopulation(stateData, outputDir);

          // Log success
          const successMsg = `✅ data of ${state} updated successfully`;
          console.log(successMsg);
          stateUpdateLogs.push(successMsg);

          results.push({
            state,
            status: 'success',
            population,
            humans: stateData.humans.length,
            connections: stateData.connections.length,
            outputDir: path.join(outputDir, state)
          });

        } catch (error) {
          const errorMsg = `❌ Failed to generate population for ${state}: ${error.message}`;
          console.error(errorMsg);
          stateUpdateLogs.push(errorMsg);
          
          results.push({
            state,
            status: 'failed',
            population,
            error: error.message
          });
        }
      }

      console.log('\n' + '='.repeat(60));
      console.log('📋 FINAL SUMMARY');
      console.log('='.repeat(60));
      
      const successCount = results.filter(r => r.status === 'success').length;
      const failedCount = results.filter(r => r.status === 'failed').length;

      console.log(`\n✅ Successfully processed: ${successCount} states`);
      console.log(`❌ Failed: ${failedCount} states`);
      
      // Print all state update logs
      console.log('\n' + '─'.repeat(60));
      console.log('STATE UPDATE LOGS:');
      console.log('─'.repeat(60));
      stateUpdateLogs.forEach(log => console.log(log));

      console.log('\n' + '='.repeat(60));
      console.log('✅ POPULATION DISTRIBUTION COMPLETE');
      console.log('='.repeat(60) + '\n');

      return {
        success: failedCount === 0,
        totalPopulation,
        statesProcessed: stateFiles.length,
        statesSuccessful: successCount,
        statesFailed: failedCount,
        results,
        outputDirectory: outputDir,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('\n❌ CRITICAL ERROR:', error.message);
      throw error;
    }
  }

  /**
   * Calculate population for each state based on real ratios
   */


  static calculateStatePopulations(states, totalPopulation) {
    const distributions = {};
    let totalAllocated = 0;

    // First pass: allocate based on ratios
    for (const state of states) {
      const ratio = STATE_POPULATION_RATIOS[state] || 0.001; // Default small ratio for unknown states
      const allocation = Math.floor(totalPopulation * ratio);
      distributions[state] = allocation;
      totalAllocated += allocation;
    }

    // Second pass: distribute remainder to ensure total equals input
    const remainder = totalPopulation - totalAllocated;

    if (remainder > 0) {
      const largerstates = states
        .sort((a, b) => (STATE_POPULATION_RATIOS[b] || 0) - (STATE_POPULATION_RATIOS[a] || 0))
        .slice(0, Math.min(remainder, states.length));
      
      largerstates.forEach((state, index) => {
        distributions[state] += (index < remainder) ? 1 : 0;
      });
    }

    return distributions;
  }
}

export default NationalPopulationDistributorController;
