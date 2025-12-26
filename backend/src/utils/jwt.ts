import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";
import type { UserDocument } from "../models/user.model.js";
import type { SessionDocument } from "../models/session.model.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";

export type AccessTokenPayload = {
  userId: UserDocument["_id"],
  sessionId: SessionDocument["_id"]
}

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"]
}

type SignOptionsAndSecret = SignOptions & {
  secret: string
}

const getDefaultOptions = <T = SignOptions>(): T => ({
  audience: ["user"]
} as T);

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
  return jwt.sign(payload, secret, { ...getDefaultOptions(), ...signOptions });
};

export const verifyToken = <TPayload = AccessTokenPayload>(token: string, options?: VerifyOptions & { secret: string }) => {
  const { secret = JWT_SECRET, ...verifyOptions } = options || {};

  try {
    const payload = jwt.verify(token, secret, { ...getDefaultOptions<VerifyOptions>(), ...verifyOptions });

    return payload as TPayload;
  } catch (error) {
    return;
  }
}