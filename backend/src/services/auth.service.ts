import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../config/http.js"
import VerificationType from "../constants/verificationTypes.js"
import UserModel from "../models/user.model.js"
import VerificationModel from "../models/verification.model.js"
import appAssert from "../utils/appAssert.js"
import { ONE_DAY_IN_MS, oneHourFromNow, thirtyDaysFromNow } from "../utils/date.js"
import SessionModel, { type SessionDocument } from "../models/session.model.js"
import { refreshTokenSignOptions, signToken, verifyToken, type RefreshTokenPayload } from "../utils/jwt.js"
import sendEmail from "../utils/sendEmail.js"
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates.js"
import { APP_ORIGIN } from "../constants/env.js"
import { hashValue } from "../utils/bcrypt.js"

type createAccountParams = {
  email: string,
  password: string,
  ipAddress?: string | undefined,
  userAgent?: string | undefined
}

export const createAccount = async (data: createAccountParams) => {
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
    expiresAt: oneHourFromNow()
  });
  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(url)
  })

  const sessionPayload = {
    userId
  } as Pick<SessionDocument, "userId" | "userAgent" | "ipAddress">

  if (data.ipAddress) sessionPayload["ipAddress"] = data.ipAddress
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
  ipAddress?: string | undefined,
  userAgent?: string | undefined
}

export const loginUser = async (data: loginParams) => {
  const user = await UserModel.findOne({ email: data.email });
  appAssert(user, BAD_REQUEST, "Invalid email or password.");

  const isPasswordValid = await user.comparePassword(data.password);
  appAssert(isPasswordValid, BAD_REQUEST, "Invalid email or password.");

  const sessionPayload = {
    userId: user._id
  } as Pick<SessionDocument, "userId" | "userAgent" | "ipAddress">

  if (data.ipAddress) sessionPayload["ipAddress"] = data.ipAddress;
  if (data.userAgent) sessionPayload["userAgent"] = data.userAgent;

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

export const refreshUserAccessToken = async (refreshToken: string) => {
  const payload = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret
  })
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token.")

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired.")

  // refreshToken needs to be refreshed
  // if the refreshToken will expire in a day or less
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_IN_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({
      sessionId: session._id
    },
      refreshTokenSignOptions
    )
    : undefined

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id
  });

  return {
    accessToken,
    newRefreshToken
  }
};

export const verifyEmail = async (code: string) => {
  const verificationCode = await VerificationModel.findOne(
    {
      _id: code,
      type: VerificationType.emailVerification,
      expiresAt: { $gt: new Date() }
    }
  );
  appAssert(verificationCode, NOT_FOUND, "Expired or invalid verification code");

  const updatedUser = await UserModel.findByIdAndUpdate(
    verificationCode.userId,
    {
      emailVerified: true
    },
    {
      new: true
    }
  )
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Internal server error.");

  await verificationCode.deleteOne();

  return {
    user: updatedUser.omitPassword()
  }
}

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, "User not found.")

  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: VerificationType.passwordReset,
    expiresAt: oneHourFromNow()
  });

  const url = `${APP_ORIGIN}auth/reset-password?code=${verificationCode._id}&exp=${verificationCode.expiresAt.getTime()}`

  const { success } = await sendEmail({
    to: user.email,
    ...getPasswordResetTemplate(url)
  })
  appAssert(success, INTERNAL_SERVER_ERROR, "Failed to send password reset email. Please try again later.")

  return;
}

export const resetPassword = async (data: { verificationCode: string, password: string }) => {
  const verificationCode = await VerificationModel.findOne(
    {
      _id: data.verificationCode,
      type: VerificationType.passwordReset,
      expiresAt: { $gt: new Date() }
    }
  );
  appAssert(verificationCode, NOT_FOUND, "Expired or invalid password reset code.");

  const user = await UserModel.findByIdAndUpdate(
    verificationCode.userId,
    {
      password: await hashValue(data.password)
    }
  )
  appAssert(user, INTERNAL_SERVER_ERROR, "Internal server error.");

  await Promise.allSettled([
    verificationCode.deleteOne(),
    SessionModel.deleteMany({
      userId: verificationCode.userId
    })
  ]);

  return {
    user: user.omitPassword()
  };
}