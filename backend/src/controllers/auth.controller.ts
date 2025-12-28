import { createAccount, forgotPassword, loginUser, refreshUserAccessToken, resetPassword, verifyEmail } from "../services/auth.service.js";
import catchErrors from "../utils/catchErrors.js";
import { setAuthCookies, clearAuthCookies, getRefreshTokenCookieOptions, getAccessTokenCookieOptions } from "../utils/cookie.js";
import { CREATED, OK, UNAUTHORIZED } from "../config/http.js";
import { loginValidation, registerValidation, resetPasswordValidation } from "../validations/auth.js";
import { verifyToken } from "../utils/jwt.js";
import SessionModel from "../models/session.model.js";
import appAssert from "../utils/appAssert.js";
import z from "zod";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerValidation.parse({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const { user, accessToken, refreshToken } = await createAccount({
    email: request.email,
    password: request.password,
    ip: request.ip,
    userAgent: request.userAgent
  })

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED).json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginValidation.parse({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const { accessToken, refreshToken } = await loginUser({
    email: request.email,
    password: request.password,
    ip: request.ip,
    userAgent: request.userAgent
  });

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK).json({ message: "Logged in successfully." });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token")

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