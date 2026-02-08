import { createAccount, forgotPassword, loginUser, refreshUserAccessToken, resetPassword, verifyEmail } from "../services/auth.service.js";
import catchErrors from "../utils/catchErrors.js";
import { setAuthCookies, clearAuthCookies, getRefreshTokenCookieOptions, getAccessTokenCookieOptions } from "../utils/cookie.js";
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../config/http.js";
import { loginValidation, registerValidation, resetPasswordValidation } from "../validations/auth.js";
import { verifyToken } from "../utils/jwt.js";
import SessionModel from "../models/session.model.js";
import appAssert from "../utils/appAssert.js";
import z from "zod";
import { oneHourFromNow } from "../utils/date.js";
import VerificationModel from "../models/verification.model.js";
import VerificationType from "../constants/verificationTypes.js";
import { APP_ORIGIN } from "../constants/env.js";
import sendEmail from "../utils/sendEmail.js";
import { getVerifyEmailTemplate } from "../utils/emailTemplates.js";
import UserModel from "../models/user.model.js";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerValidation.parse({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const { user, accessToken, refreshToken } = await createAccount({
    email: request.email,
    password: request.password,
    ipAddress: request.ipAddress,
    userAgent: request.userAgent
  })

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED).json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginValidation.parse({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const { accessToken, refreshToken } = await loginUser({
    email: request.email,
    password: request.password,
    ipAddress: request.ipAddress,
    userAgent: request.userAgent
  });

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK).json({ message: "Logged in successfully." });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Unauthorized.");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken)

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())
  }

  return res.status(OK).cookie("accessToken", accessToken, getAccessTokenCookieOptions()).json({
    message: "Access token refreshed"
  })
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const payload = verifyToken(accessToken || "");

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId)
  }

  return clearAuthCookies(res)
    .status(OK).json({ message: "Logged out successfully." });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const code = z.string().length(24).parse(req.params.code);

  await verifyEmail(code);

  return res.status(OK).json({ message: "Email verified successfully." });
});

export const forgotPasswordHandler = catchErrors(async (req, res) => {
  const email = z.email().max(255).parse(req.body.email);

  await forgotPassword(email);

  return res.status(OK).json({ message: "Password reset link sent." });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordValidation.parse(req.body);

  await resetPassword(request);

  return clearAuthCookies(res).status(OK).json({ message: "Password reset successfully." });
});

export const resendEmailHandler = catchErrors(async (req, res) => {
  const userId = z.string().length(24).parse(req.params.userId);

  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found.");

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

  return res.status(OK).json({ message: "Verification email resent successfully." });
});