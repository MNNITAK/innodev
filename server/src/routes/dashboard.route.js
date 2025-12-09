import express from "express";

const router = express.Router();

// Dashboard routes can be added here
router.get("/stats", (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 0,
      totalReports: 0,
    },
  });
});

export default router;
