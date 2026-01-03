import { Router } from "express";
import { getSessionsHandler } from "../controllers/session.controller.js";

const sessionRoutes = Router();

// prefix - /api/sessions
sessionRoutes.get("/", getSessionsHandler)

export default sessionRoutes;