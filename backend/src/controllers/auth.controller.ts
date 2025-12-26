import { createAccount, loginUser } from "../services/auth.service.js";
import catchErrors from "../utils/catchErrors.js";
import { setAuthCookies, clearAuthCookies } from "../utils/cookie.js";
import { CREATED, OK } from "../config/http.js";
import { loginValidation, registerValidation } from "../validations/auth.js";
import { verifyToken } from "../utils/jwt.js";
import SessionModel from "../models/session.model.js";

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

export const logoutHandler = catchErrors(async (req, res) => {
  const { accessToken } = req.cookies;
  const payload = verifyToken(accessToken);

  if (payload) {
    await SessionModel.findByIdAndDelete(payload?.sessionId)
  }

  return clearAuthCookies(res)
    .status(OK).json({ message: "Logged out successfully." });
});