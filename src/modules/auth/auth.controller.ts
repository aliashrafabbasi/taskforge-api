import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "./auth.service.js";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await registerUser({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginUser({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokens = await refreshAccessToken({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

export const logout = (
  _req: AuthenticatedRequest,
  res: Response
) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};