import { Router } from "express";

import {
  register,
  login,
  refresh,
  me,
  logout,
} from "./auth.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "./auth.schema.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post(
  "/refresh",
  validate(refreshTokenSchema),
  refresh
);

router.get(
  "/me",
  authenticate,
  me
);

router.post(
  "/logout",
  authenticate,
  logout
);

export default router;