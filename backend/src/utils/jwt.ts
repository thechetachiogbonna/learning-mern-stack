import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserDocument } from "../models/user.model.js";
import type { SessionDocument } from "../models/session.model.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";

type AccessTokenPayload = {
  userId: UserDocument["_id"],
  sessionId: SessionDocument["_id"]
}

type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"]
}

type SignOptionsAndSecret = SignOptions & {
  secret: string
}

const defaultOptions = {
  audience: ["user"]
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaultOptions, ...signOptions });
}; 