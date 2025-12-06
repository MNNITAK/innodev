/**
 * Example: Integration with Express API
 * Shows how to expose the NationalPopulationDistributorController as an API endpoint
 */

import express from 'express';
import NationalPopulationDistributorController from './api/NationalPopulationDistributorController.js';

const router = express.Router();

/**
 * POST /api/generate-national-population
 * 
 * Distributes total population across all Indian states and generates synthetic population
 * 
 * Request body:
 * {
 *   "totalPopulation": 50000  // optional, defaults to 1000
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "totalPopulation": 50000,
 *   "statesProcessed": 22,
 *   "statesSuccessful": 22,
 *   "statesFailed": 0,
 *   "results": [
 *     {
 *       "state": "UP",
 *       "status": "success",
 *       "population": 8415,
 *       "humans": 8415,
 *       "connections": 52891,
 *       "outputDir": "C:\\...\\human_data\\UP"
 *     },
 *     ...
 *   ],
 *   "outputDirectory": "C:\\...\\human_data",
 *   "generatedAt": "2025-12-05T10:30:00.000Z"
 * }
 */
router.post('/generate-national-population', async (req, res) => {
  try {
    const { totalPopulation = 1000 } = req.body;

    // Validate input
    if (typeof totalPopulation !== 'number' || totalPopulation < 1) {
      return res.status(400).json({
        error: 'Invalid totalPopulation. Must be a positive number.'
      });
    }

    console.log(`[API] Received request to generate ${totalPopulation} citizens`);
    
    const result = await NationalPopulationDistributorController
      .distributeAndGeneratePopulation(totalPopulation);

    res.json(result);

  } catch (error) {
    console.error('[API] Error:', error.message);
    res.status(500).json({
      error: error.message,
      details: error.stack
    });
  }
});

/**
 * GET /api/generate-national-population
 * 
 * Quick endpoint to generate default 1000 citizens without request body
 */
router.get('/generate-national-population', async (req, res) => {
  try {
    const { population = 1000 } = req.query;
    const totalPopulation = parseInt(population, 10);

    if (isNaN(totalPopulation) || totalPopulation < 1) {
      return res.status(400).json({
        error: 'Invalid population parameter. Must be a positive number.'
      });
    }

    console.log(`[API] Received request (GET) to generate ${totalPopulation} citizens`);
    
    const result = await NationalPopulationDistributorController
      .distributeAndGeneratePopulation(totalPopulation);

    res.json(result);

  } catch (error) {
    console.error('[API] Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * GET /api/population-status
 * 
 * Check if population generation is available
 */
router.get('/population-status', (req, res) => {
  res.json({
    status: 'available',
    controller: 'NationalPopulationDistributorController',
    endpoints: [
      {
        method: 'POST',
        path: '/api/generate-national-population',
        body: '{ "totalPopulation": 1000 }',
        description: 'Generate synthetic Indian population distributed by state'
      },
      {
        method: 'GET',
        path: '/api/generate-national-population?population=1000',
        description: 'Generate synthetic Indian population (GET variant)'
      }
    ],
    features: [
      'Real census-based state distribution',
      'All 22 states/UTs supported',
      'Success logging for each state',
      'Error resilience',
      'Realistic demographic parameters'
    ]
  });
});

export default router;

/**
 * Usage in main app.js:
 * 
 * import express from 'express';
 * import populationRoutes from './routes/populationRoutes.js';
 * 
 * const app = express();
 * app.use(express.json());
 * 
 * // Register routes
 * app.use('/api', populationRoutes);
 * 
 * app.listen(3000, () => {
 *   console.log('Server running on port 3000');
 * });
 * 
 * // Now you can:
 * // curl -X POST http://localhost:3000/api/generate-national-population -H "Content-Type: application/json" -d '{"totalPopulation": 5000}'
 * // curl http://localhost:3000/api/generate-national-population?population=5000
 * // curl http://localhost:3000/api/population-status
 */
