import {
  SignJWT,
  jwtVerify,
  type JWTPayload,
} from "jose";
import { env } from "../config/env.js";

const accessSecret = new TextEncoder().encode(
  env.jwt.accessSecret
);

const refreshSecret = new TextEncoder().encode(
  env.jwt.refreshSecret
);

export const generateAccessToken = async (
  payload: JWTPayload
) => {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(env.jwt.accessExpiresIn)
    .sign(accessSecret);
};

export const generateRefreshToken = async (
  payload: JWTPayload
) => {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(env.jwt.refreshExpiresIn)
    .sign(refreshSecret);
};

export const verifyAccessToken = async (
  token: string
) => {
  return jwtVerify(token, accessSecret);
};

export const verifyRefreshToken = async (
  token: string
) => {
  return jwtVerify(token, refreshSecret);
};