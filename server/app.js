import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration - more permissive for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost on any port
    if (process.env.NODE_ENV !== "production") {
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
    }

    // Allow configured client URL
    const allowedOrigins = [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
      "http://127.0.0.1:5173",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Global logger
app.use((req, res, next) => {
  console.log("📥 Incoming:", req.method, req.url);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Test endpoint

import authRouter from "./src/routes/auth.routes.js";
app.use("/api/auth", authRouter);

import userRouter from "./src/routes/user.router.js";
app.use("/api/users", userRouter);

import heatmapRouter from "./src/routes/heatmap.route.js";
app.use("/api/heatmap", heatmapRouter);

import dashboardRouter from "./src/routes/dashboard.route.js";
app.use("/api/dashboard", dashboardRouter);

import pdfRouter from "./src/routes/pdf.routes.js";
app.use("/api/pdf", pdfRouter);

import analyticsRouter from "./src/routes/analytics.route.js";
app.use("/api/analytics", analyticsRouter);

import reportRouter from "./src/routes/report.routes.js";
app.use("/api/reports", reportRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  // Handle custom API errors
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  const errors = err.error || [];

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

export { app };
