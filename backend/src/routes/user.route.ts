import { Router } from "express";
import userHandler from "../controllers/user.controller.js";

const userRoutes = Router();

// prefix - /api/user
userRoutes.get("/", userHandler);

export default userRoutes;