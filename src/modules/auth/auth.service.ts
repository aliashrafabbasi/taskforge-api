import argon2 from "argon2";

import { prisma } from "../../database/prisma/client.js";

import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from "./auth.schema.js";

import { AppError } from "../../utils/app-error.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

export const registerUser = async (input: RegisterInput) => {
  const { name, email, password } = input.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const passwordValid = await argon2.verify(
    user.passwordHash,
    password
  );

  if (!passwordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "User account is inactive",
      403,
      "ACCOUNT_INACTIVE"
    );
  }

  const accessToken = await generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken({
    sub: user.id,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },

    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const refreshAccessToken = async (
  input: RefreshTokenInput
) => {
  const { refreshToken } = input.body;

  let payload;

  try {
    const result = await verifyRefreshToken(refreshToken);
    payload = result.payload;
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401,
      "INVALID_REFRESH_TOKEN"
    );
  }

  if (typeof payload.sub !== "string") {
    throw new AppError(
      "Invalid refresh token",
      401,
      "INVALID_REFRESH_TOKEN"
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.sub,
    },

    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid refresh token",
      401,
      "INVALID_REFRESH_TOKEN"
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "User account is inactive",
      403,
      "ACCOUNT_INACTIVE"
    );
  }

  const newAccessToken = await generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = await generateRefreshToken({
    sub: user.id,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};