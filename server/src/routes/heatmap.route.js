import { Router } from "express";
import { checkJwt } from "../middleware/middleware.js";
import { getHeatmapData } from "../controllers/heatmap.controller.js";

const router = Router();

// Protected route (requires authentication)
router.get("/data", checkJwt, getHeatmapData);

// Public route for testing (no authentication required)
// This allows testing the dashboard without Auth0 setup
router.get("/data/public", getHeatmapData);

export default router;
