/**
 * Example: app.js integration with NationalPopulationDistributorController
 * 
 * This shows how to add the population generation endpoint to your Express app
 */

import express from 'express';
import NationalPopulationDistributorController from './api/NationalPopulationDistributorController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ============================================================
// POPULATION GENERATION ENDPOINTS
// ============================================================

/**
 * POST /api/generate-national-population
 * Generates synthetic Indian population distributed across all states
 * 
 * Example:
 * curl -X POST http://localhost:3000/api/generate-national-population \
 *   -H "Content-Type: application/json" \
 *   -d '{"totalPopulation": 10000}'
 */
app.post('/api/generate-national-population', async (req, res) => {
  try {
    const { totalPopulation = 1000 } = req.body;

    if (typeof totalPopulation !== 'number' || totalPopulation < 1) {
      return res.status(400).json({
        error: 'Invalid totalPopulation. Must be a positive number.'
      });
    }

    console.log(`[API] Generating ${totalPopulation} synthetic citizens...`);

    const result = await NationalPopulationDistributorController
      .distributeAndGeneratePopulation(totalPopulation);

    res.json(result);

  } catch (error) {
    console.error('[API] Error:', error.message);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/population-status
 * Returns API status and available endpoints
 */
app.get('/api/population-status', (req, res) => {
  res.json({
    status: 'operational',
    controller: 'NationalPopulationDistributorController',
    endpoints: {
      generatePopulation: {
        method: 'POST',
        path: '/api/generate-national-population',
        description: 'Generate synthetic Indian population',
        requestBody: {
          type: 'application/json',
          example: '{"totalPopulation": 10000}'
        },
        parameters: {
          totalPopulation: {
            type: 'number',
            description: 'Total synthetic citizens to generate',
            default: 1000,
            min: 1,
            required: false
          }
        }
      },
      status: {
        method: 'GET',
        path: '/api/population-status',
        description: 'Get API status and endpoint information'
      }
    },
    features: [
      'Census 2021 based state distribution',
      'Real population ratios for all 22 states/UTs',
      '50+ attributes per synthetic person',
      'Social networks (family + friends)',
      'Demographic & socio-economic data',
      'Error resilience per state'
    ],
    outputDirectory: './human_data/'
  });
});

/**
 * GET /api/generate-national-population
 * Quick variant - generate default population without JSON body
 * 
 * Example:
 * curl "http://localhost:3000/api/generate-national-population?population=5000"
 */
app.get('/api/generate-national-population', async (req, res) => {
  try {
    const { population = 1000 } = req.query;
    const totalPopulation = parseInt(population, 10);

    if (isNaN(totalPopulation) || totalPopulation < 1) {
      return res.status(400).json({
        error: 'Invalid population parameter. Must be a positive number.'
      });
    }

    console.log(`[API] Generating ${totalPopulation} synthetic citizens (GET)...`);

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


// ============================================================
// BASIC ROUTES
// ============================================================

app.get('/', (req, res) => {
  res.json({
    message: 'InnoDev Server is running',
    apiVersion: '1.0.0',
    population: {
      description: 'Synthetic Indian population generation',
      statusEndpoint: '/api/population-status',
      generateEndpoint: '/api/generate-national-population',
      documentation: 'See QUICK_START_DISTRIBUTOR.md'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      home: 'GET /',
      health: 'GET /health',
      populationStatus: 'GET /api/population-status',
      generatePopulation: 'POST /api/generate-national-population'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🚀 InnoDev Server Started');
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   GET  /                              - Server info`);
  console.log(`   GET  /health                        - Health check`);
  console.log(`   GET  /api/population-status         - API status & docs`);
  console.log(`   POST /api/generate-national-population - Generate population`);
  console.log(`   GET  /api/generate-national-population?population=10000 - Alternative`);
  console.log(`\n📚 Documentation:`);
  console.log(`   See: QUICK_START_DISTRIBUTOR.md`);
  console.log(`   See: NATIONAL_DISTRIBUTOR_README.md`);
  console.log(`${'='.repeat(60)}\n`);
});

export default app;

/**
 * Usage Instructions:
 * 
 * 1. Start server:
 *    node app.js
 * 
 * 2. Check health:
 *    curl http://localhost:3000/health
 * 
 * 3. Check API status:
 *    curl http://localhost:3000/api/population-status
 * 
 * 4. Generate 5000 synthetic Indians:
 *    POST request:
 *      curl -X POST http://localhost:3000/api/generate-national-population \
 *        -H "Content-Type: application/json" \
 *        -d '{"totalPopulation": 5000}'
 * 
 *    OR GET request:
 *      curl "http://localhost:3000/api/generate-national-population?population=5000"
 * 
 * 5. Watch console for:
 *    - Distribution breakdown
 *    - Per-state generation progress
 *    - Success/failure counts
 *    - Output: "✅ data of {state} updated successfully"
 * 
 * 6. Check generated files:
 *    ls human_data/
 *    ls human_data/UP/     (Uttar Pradesh)
 *    ls human_data/Bihar/  (Bihar)
 *    etc.
 */
