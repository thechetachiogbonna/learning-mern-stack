import assert from "node:assert";
import type { HttpStatusCode } from "../config/http.js";
import type AppErrorCode from "../constants/appErrorCode.js";
import AppError from "./AppError.js";

type AppAssert = (
  condition: unknown,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

/**
 * Custom assertion function that throws an AppError when the condition is falsy.
 * @param condition - The condition to assert.
 * @param httpStatusCode - The HTTP status code for the error.
 * @param message - The error message.
 * @param appErrorCode - The application error code.
 * @throws AppError
*/

const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) => {
  return assert(condition, new AppError(message, httpStatusCode, appErrorCode));
};

export default appAssert;