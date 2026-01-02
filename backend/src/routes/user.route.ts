import { Router } from "express";
import userHandler from "../controllers/user.controller.js";

const userRoutes = Router();

// prefix - /api/users
userRoutes.get("/", userHandler);

export default userRoutes;