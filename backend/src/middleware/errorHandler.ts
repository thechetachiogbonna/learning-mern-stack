import type { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../config/http.js";
import z from "zod";

const handleZodError = (res: Response, error: z.ZodError) => {
  res.status(BAD_REQUEST).json({
    path: JSON.parse(error.message)[0].path[0],
    message: JSON.parse(error.message)[0].message
  })
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH: ${req.path} - ERROR: ${err.message}`);

  if (err instanceof z.ZodError) {
    return handleZodError(res, err)
  }
  return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
}

export default errorHandler;