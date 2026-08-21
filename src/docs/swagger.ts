import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "TaskForge API",
    version: "1.0.0",
    description:
      "Project and issue management REST API built with Node.js, TypeScript, and Express.",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  tags: [
    {
      name: "Health",
      description: "API health and system status",
    },
    {
      name: "Authentication",
      description: "User authentication and account management",
    },
  ],

  paths: {
    "/api/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",

        responses: {
          "200": {
            description: "API is healthy",
          },
        },
      },
    },

    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description: "Creates a new TaskForge user account.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],

                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "User Bot",
                  },

                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },

                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    maxLength: 128,
                    example: "abcd09876",
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "User registered successfully",
          },

          "400": {
            description: "Invalid request data",
          },

          "409": {
            description: "User with this email already exists",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        description:
          "Authenticates a user and returns access and refresh tokens.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],

                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },

                  password: {
                    type: "string",
                    format: "password",
                    example: "abcd09876",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Login successful",
          },

          "400": {
            description: "Invalid request data",
          },

          "401": {
            description: "Invalid email or password",
          },

          "403": {
            description: "User account is inactive",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/v1/auth/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh access token",
        description:
          "Generates a new access token using a valid refresh token.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],

                properties: {
                  refreshToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIs...",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Token refreshed successfully",
          },

          "400": {
            description: "Invalid request data",
          },

          "401": {
            description: "Invalid or expired refresh token",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/v1/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current authenticated user",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "Authenticated user returned successfully",
          },

          "401": {
            description:
              "Authentication required or token is invalid/expired",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/v1/auth/admin-test": {
      get: {
        tags: ["Authentication"],
        summary: "Test admin authorization",
        description:
          "Tests whether the authenticated user has ADMIN privileges.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "User is authorized as ADMIN",
          },

          "401": {
            description:
              "Authentication required or token is invalid/expired",
          },

          "403": {
            description:
              "User does not have ADMIN privileges",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/v1/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout user",
        description:
          "Logs out the currently authenticated user.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "Logout successful",
          },

          "401": {
            description:
              "Authentication required or token is invalid/expired",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
};