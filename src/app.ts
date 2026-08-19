import express from "express";
import { setupSwagger } from "./docs/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";

const app = express();

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "taskforge-api",
  });
});

setupSwagger(app);

// Must be AFTER all routes
app.use(notFoundHandler);

// Must be LAST
app.use(errorHandler);

export default app;