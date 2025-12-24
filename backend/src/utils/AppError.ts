import type { HttpStatusCode } from "../config/http.js";
import type AppErrorCode from "../constants/appErrorCode.js";

class AppError extends Error {
  constructor(message: string, public statusCode: HttpStatusCode, public errorCode?: AppErrorCode) {
    super(message);
    this.name = "AppError"
  }
}

export default AppError;