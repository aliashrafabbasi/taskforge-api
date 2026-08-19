import type { RequestHandler } from "express";
import { ZodError, type ZodType } from "zod";
import { AppError } from "../utils/app-error.js";

export const validate = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            "Request validation failed",
            400,
            "VALIDATION_ERROR"
          )
        );

        return;
      }

      next(error);
    }
  };
};