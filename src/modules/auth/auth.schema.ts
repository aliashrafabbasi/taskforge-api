import { z } from "zod";

const emptyParams = z.object({}).passthrough();
const emptyQuery = z.object({}).passthrough();

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),

  params: emptyParams,
  query: emptyQuery,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),

  params: emptyParams,
  query: emptyQuery,
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),

  params: emptyParams,
  query: emptyQuery,
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;