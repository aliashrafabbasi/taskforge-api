import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes.js";
import { setupSwagger } from "./docs/swagger.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security
app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

// Body parsing
app.use(express.json());

// Health
app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "taskforge-api",
  });
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);

// API Documentation
setupSwagger(app);

// 404 handler — must be after all routes
app.use(notFoundHandler);

// Global error handler — must be last
app.use(errorHandler);

export default app;