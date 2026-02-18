import type { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../config/http.js";
import z from "zod";
import AppError from "../utils/AppError.js";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookie.js";

const handleZodError = (res: Response, error: z.ZodError) => {
  res.status(BAD_REQUEST).json({
    path: JSON.parse(error.message)[0].path[0],
    message: JSON.parse(error.message)[0].message
  })
}

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode
  })
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`${req.method} - PATH: ${req.path} - ERROR: ${err.message}`);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res)
  }

  if (err instanceof z.ZodError) {
    return handleZodError(res, err);
  }

  if (err instanceof AppError) {
    return handleAppError(res, err);
  }

  console.log("here here in error middleware", err)
  return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
}

export default errorHandler;