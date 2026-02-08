import { Router } from "express"
import { forgotPasswordHandler, loginHandler, logoutHandler, refreshHandler, registerHandler, resendEmailHandler, resetPasswordHandler, verifyEmailHandler } from "../controllers/auth.controller.js";

const authRoutes = Router();

// prefix - /api/auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.get("/email/resend/:userId", resendEmailHandler);
authRoutes.post("/password/forgot", forgotPasswordHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;