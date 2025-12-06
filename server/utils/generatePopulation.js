/**
 * Execution script for population generation
 * Usage: node utils/generatePopulation.js [population] [state(optional)]
 */

import path from 'path';
import { fileURLToPath } from 'url';
import PopulationGeneratorController from '../api/PopulationGeneratorController.js';
import StatePopulationGenerator from '../State_api/StatePopulationGenerator.js';

// Fix for ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  const totalPopulation = parseInt(args[0]) || 1000;
  const specificState = args[1] || null;

  try {
    if (specificState) {
      console.log(`\n🎯 Generating population for ${specificState} only...`);

      const stateData = await StatePopulationGenerator.generateStatePopulation(
        specificState,
        totalPopulation
      );

      const outputDir = path.join(__dirname, '../human_data');
      await StatePopulationGenerator.saveStatePopulation(stateData, outputDir);

      console.log(`\n✅ State population saved to human_data/${specificState}/`);
    } else {
      const result = await PopulationGeneratorController.generateNationalPopulation(totalPopulation);
      console.log(`\n${JSON.stringify(result, null, 2)}`);
    }
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

main();
