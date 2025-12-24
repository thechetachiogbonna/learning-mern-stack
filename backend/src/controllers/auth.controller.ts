import { registerSchema } from "../validations/auth.js";
import { createAccount } from "../services/auth.service.js";
import catchErrors from "../utils/catchErrors.js";
import setAuthCookies from "../utils/setAuthCookies.js";
import { CREATED } from "../config/http.js";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  })

  console.log(request);

  const { user, refreshToken, accessToken } = await createAccount({
    email: request.email,
    password: request.password,
    ip: request.ip,
    userAgent: request.userAgent
  })

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(CREATED).json(user);
});