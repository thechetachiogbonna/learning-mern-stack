import jwt from "jsonwebtoken"
import { CONFLICT } from "../config/http.js"
import VerificationType from "../constants/verificationTypes.js"
import UserModel from "../models/user.model.js"
import VerificationModel from "../models/verification.model.js"
import appAssert from "../utils/appAssert.js"
import { oneYearFromNow } from "../utils/date.js"
import SessionModel, { type SessionDocument } from "../models/session.model.js"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js"

export type createAccountParams = {
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
  })

  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: VerificationType.emailVerification,
    expiresAt: oneYearFromNow()
  });

  const sessionPayload = {
    userId: user._id
  } as Pick<SessionDocument, "userId" | "userAgent" | "ip">

  if (data.ip) sessionPayload["ip"] = data.ip
  if (data.userAgent) sessionPayload["userAgent"] = data.userAgent

  const session = await SessionModel.create(sessionPayload);

  const accessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m"
    }
  );

  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d"
    }
  );

  return {
    user: user.omitPassword(),
    refreshToken,
    accessToken
  };
}