import jwt from "jsonwebtoken"
import { BAD_REQUEST, CONFLICT } from "../config/http.js"
import VerificationType from "../constants/verificationTypes.js"
import UserModel from "../models/user.model.js"
import VerificationModel from "../models/verification.model.js"
import appAssert from "../utils/appAssert.js"
import { oneYearFromNow } from "../utils/date.js"
import SessionModel, { type SessionDocument } from "../models/session.model.js"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js"
import { refreshTokenSignOptions, signToken } from "../utils/jwt.js"

type createAccountParams = {
  email: string,
  password: string,
  ip?: string | undefined,
  userAgent?: string | undefined
}

export const createAccount = async (data: createAccountParams): Promise<any> => {
  const existingUser = await UserModel.exists({ email: data.email })

  appAssert(!existingUser, CONFLICT, "Email is already in use.")

  const user = await UserModel.create({
    email: data.email,
    password: data.password
  });

  const userId = user._id;

  const verificationCode = await VerificationModel.create({
    userId,
    type: VerificationType.emailVerification,
    expiresAt: oneYearFromNow()
  });

  const sessionPayload = {
    userId
  } as Pick<SessionDocument, "userId" | "userAgent" | "ip">

  if (data.ip) sessionPayload["ip"] = data.ip
  if (data.userAgent) sessionPayload["userAgent"] = data.userAgent

  const session = await SessionModel.create(sessionPayload);

  const accessToken = signToken({
    userId,
    sessionId: session._id
  });

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  };
}

type loginParams = {
  email: string,
  password: string,
  ip?: string | undefined,
  userAgent?: string | undefined
}

export const loginUser = async (data: loginParams): Promise<any> => {
  const user = await UserModel.findOne({ email: data.email });
  appAssert(user, BAD_REQUEST, "Invalid email or password.");

  const isPasswordValid = await user.comparePassword(data.password);
  appAssert(isPasswordValid, BAD_REQUEST, "Invalid email or password.");

  const sessionPayload = {
    userId: user._id
  } as Pick<SessionDocument, "userId" | "userAgent" | "ip">

  if (data.ip) sessionPayload["ip"] = data.ip
  if (data.userAgent) sessionPayload["userAgent"] = data.userAgent

  const session = await SessionModel.create(sessionPayload);

  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id
  });

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  return {
    accessToken,
    refreshToken
  };
}